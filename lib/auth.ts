import "server-only";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, ProfileRole } from "@/lib/types";

export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, family_id, name, coins")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return { supabase, user, profile };
}

export async function requireProfile(role?: ProfileRole) {
  const session = await getCurrentProfile();

  if (!session.user) {
    redirect("/login");
  }

  if (!session.profile) {
    redirect(`/login?error=${encodeURIComponent("Perfil não encontrado.")}`);
  }

  if (role && session.profile.role !== role) {
    redirect(session.profile.role === "mother" ? "/mother" : "/child");
  }

  return {
    supabase: session.supabase,
    user: session.user,
    profile: session.profile
  };
}
