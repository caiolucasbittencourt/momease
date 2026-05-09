import { completeTask, redeemReward } from "@/app/actions/child";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmptyState } from "@/components/EmptyState";
import { MessageBanner } from "@/components/MessageBanner";
import { requireProfile } from "@/lib/auth";
import type { Reward, Task } from "@/lib/types";

type ChildPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function ChildPage({ searchParams }: ChildPageProps) {
  const params = await searchParams;
  const { supabase, profile } = await requireProfile("child");

  const { data: taskRows } = await supabase
    .from("tasks")
    .select("id, family_id, title, details, assignee_id, deadline, status")
    .eq("assignee_id", profile.id)
    .order("deadline", { ascending: true });

  const { data: rewardRows } = await supabase
    .from("rewards")
    .select("id, family_id, title, cost")
    .eq("family_id", profile.family_id)
    .order("cost", { ascending: true });

  const tasks = ((taskRows ?? []) as Task[]).sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === "pending" ? -1 : 1;
    }

    return new Date(left.deadline).getTime() - new Date(right.deadline).getTime();
  });
  const rewards = (rewardRows ?? []) as Reward[];

  return (
    <>
      <DashboardHeader
        aside={
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900">
            {profile.coins} estrelas
          </div>
        }
        name={`Olá, ${profile.name}`}
        roleLabel="Painel do filho"
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

            {tasks.length === 0 ? (
              <EmptyState>Nenhuma tarefa atribuída.</EmptyState>
            ) : (
              <div className="grid gap-3">
                {tasks.map((task) => {
                  const isCompleted = task.status === "completed";

                  return (
                    <article
                      className="rounded-md border border-stone-200 bg-paper p-4"
                      key={task.id}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-ink">{task.title}</h3>
                          {task.details ? (
                            <p className="mt-1 text-sm text-stone-600">
                              {task.details}
                            </p>
                          ) : null}
                          <p className="mt-3 text-sm text-stone-600">
                            Prazo: {formatDate(task.deadline)}
                          </p>
                        </div>

                        {isCompleted ? (
                          <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            Concluída
                          </span>
                        ) : (
                          <form action={completeTask}>
                            <input name="task_id" type="hidden" value={task.id} />
                            <button className="button" type="submit">
                              Concluir
                            </button>
                          </form>
                        )}
                      </div>
                    </article>
                  );
                })}
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
                      className="rounded-md border border-stone-200 p-4"
                      key={reward.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-ink">{reward.title}</h3>
                          <p className="mt-1 text-sm font-semibold text-coral">
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
    </>
  );
}
