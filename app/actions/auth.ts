"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { formText, redirectWithMessage } from "@/app/actions/helpers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function describeAuthError(error: unknown) {
  if (!(error instanceof Error)) {
    return "Erro desconhecido.";
  }

  const details = error as Error & {
    status?: number;
    code?: string;
    cause?: { message?: string; code?: string };
  };

  const parts = [details.message];

  if (details.name) {
    parts.push(`name=${details.name}`);
  }

  if (details.status) {
    parts.push(`status=${details.status}`);
  }

  if (details.code) {
    parts.push(`code=${details.code}`);
  }

  if (details.cause?.message) {
    parts.push(`cause=${details.cause.message}`);
  }

  if (details.cause?.code) {
    parts.push(`cause_code=${details.cause.code}`);
  }

  return parts.join(" | ");
}

export async function registerMother(formData: FormData) {
  const name = formText(formData, "name");
  const email = formText(formData, "email").toLowerCase();
  const password = formText(formData, "password");

  if (!name || !email || password.length < 6) {
    redirect(
      redirectWithMessage(
        "/register",
        "error",
        "Informe nome, email e uma senha com pelo menos 6 caracteres."
      )
    );
  }

  let admin: ReturnType<typeof createSupabaseAdminClient>;

  try {
    admin = createSupabaseAdminClient();
  } catch {
    redirect(
      redirectWithMessage(
        "/register",
        "error",
        "Configure SUPABASE_SERVICE_ROLE_KEY para criar o perfil da mãe."
      )
    );
  }

  const familyId = crypto.randomUUID();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role: "mother",
      family_id: familyId
    }
  });

  if (error) {
    const message = describeAuthError(error);
    console.error("[MomEase] registerMother createUser failed:", message);
    redirect(redirectWithMessage("/register", "error", message));
  }

  if (!data.user) {
    redirect(
      redirectWithMessage("/register", "error", "Não foi possível criar a conta.")
    );
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: data.user.id,
    role: "mother",
    family_id: familyId,
    name,
    coins: 0
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    redirect(
      redirectWithMessage(
        "/register",
        "error",
        `Conta removida porque o perfil não foi criado: ${profileError.message}`
      )
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    redirect(
      redirectWithMessage(
        "/login",
        "notice",
        "Cadastro criado. Entre com o email e senha para continuar."
      )
    );
  }

  revalidatePath("/", "layout");
  redirect(
    redirectWithMessage("/mother", "notice", "Cadastro concluído. Bem-vinda! Para criar tarefas, primeiro adicione um filho em Membros.")
  );
}

export async function login(formData: FormData) {
  const email = formText(formData, "email").toLowerCase();
  const password = formText(formData, "password");

  if (!email || !password) {
    redirect(
      redirectWithMessage("/login", "error", "Informe email e senha para entrar.")
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(redirectWithMessage("/login", "error", error.message));
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      redirectWithMessage("/login", "error", "Sessão não encontrada após login.")
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: "mother" | "child" }>();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    redirect(
      redirectWithMessage(
        "/login",
        "error",
        "Login feito, mas nenhum perfil MomEase foi encontrado."
      )
    );
  }

  revalidatePath("/", "layout");
  redirect(profile.role === "mother" ? "/mother" : "/child");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
