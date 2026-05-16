import type { Metadata } from "next";
import { completeTask, redeemReward } from "@/app/actions/child";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmptyState } from "@/components/EmptyState";
import { LocalDateTimeText } from "@/components/LocalDateTimeText";
import { MessageBanner } from "@/components/MessageBanner";
import { requireProfile } from "@/lib/auth";
import type { Reward, Task } from "@/lib/types";
import { Check, Gift, Star } from "lucide-react";

type ChildPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: {
    absolute: "Dashboard | MonEase",
  },
};

export default async function ChildPage({ searchParams }: ChildPageProps) {
  const params = await searchParams;
  const { supabase, profile } = await requireProfile("child");

  const { data: taskRows } = await supabase
    .from("tasks")
    .select(
      "id, family_id, title, details, assignee_id, deadline, status, completed_at",
    )
    .eq("assignee_id", profile.id)
    .order("deadline", { ascending: true });

  const { data: rewardRows } = await supabase
    .from("rewards")
    .select("id, family_id, title, cost")
    .eq("family_id", profile.family_id)
    .order("cost", { ascending: true });

  const tasks = (taskRows ?? []) as Task[];
  const pendingTasks = tasks
    .filter((task) => task.status === "pending")
    .sort(
      (left, right) =>
        new Date(left.deadline).getTime() - new Date(right.deadline).getTime(),
    );
  const completedTasks = tasks
    .filter((task) => task.status === "completed")
    .sort((left, right) => {
      const leftDate = new Date(left.completed_at ?? left.deadline).getTime();
      const rightDate = new Date(
        right.completed_at ?? right.deadline,
      ).getTime();

      return rightDate - leftDate;
    });
  const rewards = (rewardRows ?? []) as Reward[];

  return (
    <div className="min-h-screen bg-[#d94f8a]">
      <DashboardHeader
        aside={
          <div className="inline-flex items-center gap-2 rounded-md bg-blush px-4 py-2 text-sm font-semibold text-berry">
            <Star aria-hidden="true" size={16} strokeWidth={2.25} />
            {profile.coins} estrelas
          </div>
        }
      />

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
        <div className="space-y-6">
          <MessageBanner error={params.error} notice={params.notice} />

          <section className="surface space-y-5">
            <div>
              <h2 className="section-title">Minhas tarefas</h2>
              <p className="text-sm text-stone-600">
                Concluir no prazo soma 1 estrela.
              </p>
            </div>

            {pendingTasks.length === 0 ? (
              <EmptyState>Nenhuma tarefa pendente.</EmptyState>
            ) : (
              <div className="grid gap-3">
                {pendingTasks.map((task) => (
                  <article className="rounded-md bg-paper p-4" key={task.id}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-ink">{task.title}</h3>
                        {task.details ? (
                          <p className="mt-1 text-sm text-stone-600">
                            {task.details}
                          </p>
                        ) : null}
                        <p className="mt-3 text-sm text-stone-600">
                          Prazo: <LocalDateTimeText value={task.deadline} />
                        </p>
                      </div>

                      <form action={completeTask}>
                        <input name="task_id" type="hidden" value={task.id} />
                        <button className="button" type="submit">
                          <Check
                            aria-hidden="true"
                            size={16}
                            strokeWidth={2.25}
                          />
                          Concluir
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="surface space-y-5">
            <div>
              <h2 className="section-title">Histórico de tarefas</h2>
              <p className="text-sm text-stone-600">
                Suas tarefas concluídas ficam registradas aqui.
              </p>
            </div>

            {completedTasks.length === 0 ? (
              <EmptyState>Nenhuma tarefa concluída ainda.</EmptyState>
            ) : (
              <div className="grid gap-3">
                {completedTasks.map((task) => (
                  <article className="rounded-md bg-white p-4" key={task.id}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-ink">{task.title}</h3>
                        {task.details ? (
                          <p className="mt-1 text-sm text-stone-600">
                            {task.details}
                          </p>
                        ) : null}
                      </div>
                      <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        Concluída
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-stone-600">
                      <p>
                        Prazo: <LocalDateTimeText value={task.deadline} />
                      </p>
                      <p>
                        Conclusão:{" "}
                        {task.completed_at
                          ? <LocalDateTimeText value={task.completed_at} />
                          : "data não registrada"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="surface space-y-5">
            <div>
              <h2 className="section-title">Loja de prêmios</h2>
              <p className="text-sm text-stone-600">
                Saldo atual: {profile.coins} estrelas.
              </p>
            </div>

            {rewards.length === 0 ? (
              <EmptyState>Nenhum prêmio disponível.</EmptyState>
            ) : (
              <div className="grid gap-3">
                {rewards.map((reward) => {
                  const canRedeem = profile.coins >= reward.cost;

                  return (
                    <article
                      className="rounded-md bg-white p-4"
                      key={reward.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-ink">
                            {reward.title}
                          </h3>
                          <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-rose">
                            <Star
                              aria-hidden="true"
                              size={15}
                              strokeWidth={2.25}
                            />
                            {reward.cost} estrelas
                          </p>
                        </div>
                        <form action={redeemReward}>
                          <input
                            name="reward_id"
                            type="hidden"
                            value={reward.id}
                          />
                          <button
                            className="button"
                            disabled={!canRedeem}
                            type="submit"
                          >
                            <Gift
                              aria-hidden="true"
                              size={16}
                              strokeWidth={2.25}
                            />
                            Resgatar
                          </button>
                        </form>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </aside>
      </main>
    </div>
  );
}
