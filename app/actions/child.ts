"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { formText, redirectWithMessage } from "@/app/actions/helpers";
import { requireProfile } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Reward, Task } from "@/lib/types";

export async function completeTask(formData: FormData) {
  const { supabase, profile } = await requireProfile("child");
  const taskId = formText(formData, "task_id");

  if (!taskId) {
    redirect(redirectWithMessage("/child", "error", "Tarefa inválida."));
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("id, deadline, status, assignee_id")
    .eq("id", taskId)
    .eq("assignee_id", profile.id)
    .maybeSingle<Pick<Task, "id" | "deadline" | "status" | "assignee_id">>();

  if (!task) {
    redirect(
      redirectWithMessage("/child", "error", "Tarefa não encontrada para você.")
    );
  }

  if (task.status === "completed") {
    redirect(redirectWithMessage("/child", "error", "Tarefa já concluída."));
  }

  if (new Date(task.deadline).getTime() < Date.now()) {
    redirect(
      redirectWithMessage(
        "/child",
        "error",
        "Prazo expirado. A tarefa não gerou estrela."
      )
    );
  }

  let admin: ReturnType<typeof createSupabaseAdminClient>;

  try {
    admin = createSupabaseAdminClient();
  } catch {
    redirect(
      redirectWithMessage(
        "/child",
        "error",
        "Configure SUPABASE_SERVICE_ROLE_KEY para concluir tarefas."
      )
    );
  }

  const { data: updatedTask, error: taskError } = await admin
    .from("tasks")
    .update({ completed_at: new Date().toISOString(), status: "completed" })
    .eq("id", task.id)
    .eq("assignee_id", profile.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle<{ id: string }>();

  if (taskError || !updatedTask) {
    redirect(
      redirectWithMessage(
        "/child",
        "error",
        taskError?.message ?? "Tarefa já foi atualizada."
      )
    );
  }

  const { error: coinError } = await admin
    .from("profiles")
    .update({ coins: profile.coins + 1 })
    .eq("id", profile.id);

  if (coinError) {
    redirect(redirectWithMessage("/child", "error", coinError.message));
  }

  revalidatePath("/child");
  redirect(
    redirectWithMessage("/child", "notice", "Tarefa concluída. +1 estrela!")
  );
}

export async function redeemReward(formData: FormData) {
  const { supabase, profile } = await requireProfile("child");
  const rewardId = formText(formData, "reward_id");

  if (!rewardId) {
    redirect(redirectWithMessage("/child", "error", "Prêmio inválido."));
  }

  const { data: reward } = await supabase
    .from("rewards")
    .select("id, title, cost, family_id")
    .eq("id", rewardId)
    .eq("family_id", profile.family_id)
    .maybeSingle<Reward>();

  if (!reward) {
    redirect(redirectWithMessage("/child", "error", "Prêmio não encontrado."));
  }

  if (profile.coins < reward.cost) {
    redirect(
      redirectWithMessage("/child", "error", "Estrelas insuficientes para resgatar.")
    );
  }

  let admin: ReturnType<typeof createSupabaseAdminClient>;

  try {
    admin = createSupabaseAdminClient();
  } catch {
    redirect(
      redirectWithMessage(
        "/child",
        "error",
        "Configure SUPABASE_SERVICE_ROLE_KEY para resgatar prêmios."
      )
    );
  }

  const { error } = await admin
    .from("profiles")
    .update({ coins: profile.coins - reward.cost })
    .eq("id", profile.id);

  if (error) {
    redirect(redirectWithMessage("/child", "error", error.message));
  }

  revalidatePath("/child");
  redirect(
    redirectWithMessage(
      "/child",
      "notice",
      `Prêmio "${reward.title}" resgatado.`
    )
  );
}
