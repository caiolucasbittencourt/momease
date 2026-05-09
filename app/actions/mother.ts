"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  formOptionalText,
  formText,
  redirectWithMessage
} from "@/app/actions/helpers";
import { requireProfile } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createChildAccount(formData: FormData) {
  const { profile } = await requireProfile("mother");
  const name = formText(formData, "name");
  const email = formText(formData, "email").toLowerCase();
  const password = formText(formData, "password");

  if (!name || !email || password.length < 6) {
    redirect(
      redirectWithMessage(
        "/mother",
        "error",
        "Informe nome, email e senha temporária com pelo menos 6 caracteres."
      )
    );
  }

  let admin: ReturnType<typeof createSupabaseAdminClient>;

  try {
    admin = createSupabaseAdminClient();
  } catch {
    redirect(
      redirectWithMessage(
        "/mother",
        "error",
        "Configure SUPABASE_SERVICE_ROLE_KEY para criar contas de filhos."
      )
    );
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role: "child",
      family_id: profile.family_id
    }
  });

  if (error || !data.user) {
    redirect(
      redirectWithMessage(
        "/mother",
        "error",
        error?.message ?? "Não foi possível criar o usuário filho."
      )
    );
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: data.user.id,
    role: "child",
    family_id: profile.family_id,
    name,
    coins: 0
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    redirect(
      redirectWithMessage(
        "/mother",
        "error",
        `Usuário removido porque o perfil do filho não foi criado: ${profileError.message}`
      )
    );
  }

  revalidatePath("/mother");
  redirect(redirectWithMessage("/mother", "notice", "Filho adicionado."));
}

export async function createTask(formData: FormData) {
  const { supabase, profile } = await requireProfile("mother");
  const title = formText(formData, "title");
  const details = formOptionalText(formData, "details");
  const assigneeId = formText(formData, "assignee_id");
  const deadlineRaw = formText(formData, "deadline");
  const deadline = new Date(deadlineRaw);

  if (!title || !assigneeId || Number.isNaN(deadline.getTime())) {
    redirect(
      redirectWithMessage(
        "/mother",
        "error",
        "Informe tarefa, responsável e prazo válido."
      )
    );
  }

  if (deadline.getTime() <= Date.now()) {
    redirect(
      redirectWithMessage("/mother", "error", "O prazo precisa estar no futuro.")
    );
  }

  const { data: child } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", assigneeId)
    .eq("role", "child")
    .eq("family_id", profile.family_id)
    .maybeSingle<{ id: string }>();

  if (!child) {
    redirect(
      redirectWithMessage(
        "/mother",
        "error",
        "Responsável inválido para esta família."
      )
    );
  }

  const { error } = await supabase.from("tasks").insert({
    family_id: profile.family_id,
    title,
    details,
    assignee_id: child.id,
    deadline: deadline.toISOString(),
    status: "pending"
  });

  if (error) {
    redirect(redirectWithMessage("/mother", "error", error.message));
  }

  revalidatePath("/mother");
  redirect(redirectWithMessage("/mother", "notice", "Tarefa criada."));
}

export async function createReward(formData: FormData) {
  const { supabase, profile } = await requireProfile("mother");
  const title = formText(formData, "title");
  const cost = Number.parseInt(formText(formData, "cost"), 10);

  if (!title || !Number.isInteger(cost) || cost <= 0) {
    redirect(
      redirectWithMessage(
        "/mother",
        "error",
        "Informe um prêmio e custo em estrelas maior que zero."
      )
    );
  }

  const { error } = await supabase.from("rewards").insert({
    family_id: profile.family_id,
    title,
    cost
  });

  if (error) {
    redirect(redirectWithMessage("/mother", "error", error.message));
  }

  revalidatePath("/mother");
  redirect(redirectWithMessage("/mother", "notice", "Prêmio criado."));
}

export async function deleteReward(formData: FormData) {
  const { supabase, profile } = await requireProfile("mother");
  const rewardId = formText(formData, "reward_id");

  if (!rewardId) {
    redirect(redirectWithMessage("/mother", "error", "Prêmio inválido."));
  }

  const { data, error } = await supabase
    .from("rewards")
    .delete()
    .eq("id", rewardId)
    .eq("family_id", profile.family_id)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error || !data) {
    redirect(
      redirectWithMessage(
        "/mother",
        "error",
        error?.message ?? "Prêmio não encontrado para esta família."
      )
    );
  }

  revalidatePath("/mother");
  revalidatePath("/child");
  redirect(redirectWithMessage("/mother", "notice", "Prêmio excluído."));
}
