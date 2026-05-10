import type { Metadata } from "next";
import {
  createChildAccount,
  createReward,
  createTask,
  deleteReward,
} from "@/app/actions/mother";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmptyState } from "@/components/EmptyState";
import { MessageBanner } from "@/components/MessageBanner";
import { requireProfile } from "@/lib/auth";
import type { Profile, Reward, Task } from "@/lib/types";
import { Gift, Plus, Star, Trash2, UserPlus } from "lucide-react";

type MotherPageProps = {
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

const taskSuggestions = [
  "Lavar louça",
  "Arrumar cama",
  "Guardar brinquedos",
  "Fazer dever de casa",
  "Organizar mochila",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function MotherPage({ searchParams }: MotherPageProps) {
  const params = await searchParams;
  const { supabase, profile } = await requireProfile("mother");

  const { data: childRows } = await supabase
    .from("profiles")
    .select("id, role, family_id, name, coins")
    .eq("family_id", profile.family_id)
    .eq("role", "child")
    .order("name", { ascending: true });

  const { data: taskRows } = await supabase
    .from("tasks")
    .select(
      "id, family_id, title, details, assignee_id, deadline, status, completed_at",
    )
    .eq("family_id", profile.family_id)
    .eq("status", "pending")
    .order("deadline", { ascending: true });

  const { data: completedTaskRows } = await supabase
    .from("tasks")
    .select(
      "id, family_id, title, details, assignee_id, deadline, status, completed_at",
    )
    .eq("family_id", profile.family_id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  const { data: rewardRows } = await supabase
    .from("rewards")
    .select("id, family_id, title, cost")
    .eq("family_id", profile.family_id)
    .order("cost", { ascending: true });

  const children = (childRows ?? []) as Profile[];
  const tasks = (taskRows ?? []) as Task[];
  const completedTasks = ((completedTaskRows ?? []) as Task[]).sort(
    (left, right) => {
      const leftDate = new Date(left.completed_at ?? left.deadline).getTime();
      const rightDate = new Date(
        right.completed_at ?? right.deadline,
      ).getTime();

      return rightDate - leftDate;
    },
  );
  const rewards = (rewardRows ?? []) as Reward[];
  const childById = new Map(children.map((child) => [child.id, child]));

  return (
    <div className="min-h-screen bg-[#d94f8a]">
      <DashboardHeader name={`Olá, ${profile.name}`} />

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
        <div className="space-y-6">
          <MessageBanner error={params.error} notice={params.notice} />

          <section className="surface space-y-5">
            <div>
              <h2 className="section-title">Tarefas</h2>
              <p className="text-sm text-stone-600">
                Cada tarefa concluída no prazo vale 1 estrela.
              </p>
            </div>

            <form action={createTask} className="grid gap-4 md:grid-cols-2">
              <label className="field md:col-span-2">
                <span className="label">Nome da tarefa</span>
                <input
                  className="input"
                  list="task-suggestions"
                  name="title"
                  placeholder="Ex: Lavar louça"
                  required
                />
                <datalist id="task-suggestions">
                  {taskSuggestions.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
              </label>

              <label className="field md:col-span-2">
                <span className="label">Detalhes</span>
                <textarea
                  className="input min-h-24 resize-y"
                  name="details"
                  placeholder="Opcional"
                />
              </label>

              <label className="field">
                <span className="label">Responsável</span>
                <select className="input" name="assignee_id" required>
                  <option value="">Selecione</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="label">Prazo</span>
                <input
                  className="input"
                  name="deadline"
                  type="datetime-local"
                  required
                />
              </label>

              <div className="md:col-span-2">
                <button
                  className="button w-full sm:w-auto"
                  disabled={children.length === 0}
                  type="submit"
                >
                  <Plus aria-hidden="true" size={16} strokeWidth={2.25} />
                  Criar tarefa
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                Ativas
              </h3>

              {tasks.length === 0 ? (
                <EmptyState>Nenhuma tarefa ativa.</EmptyState>
              ) : (
                <div className="grid gap-3">
                  {tasks.map((task) => {
                    const child = childById.get(task.assignee_id);

                    return (
                      <article
                        className="rounded-md bg-paper p-4"
                        key={task.id}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="font-semibold text-ink">
                              {task.title}
                            </h4>
                            {task.details ? (
                              <p className="mt-1 text-sm text-stone-600">
                                {task.details}
                              </p>
                            ) : null}
                          </div>
                          <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                            Pendente
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-stone-600">
                          {child?.name ?? "Responsável removido"} -{" "}
                          {formatDate(task.deadline)}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="surface space-y-5">
            <div>
              <h2 className="section-title">Histórico de tarefas</h2>
              <p className="text-sm text-stone-600">
                Tarefas concluídas pelos filhos da família.
              </p>
            </div>

            {completedTasks.length === 0 ? (
              <EmptyState>Nenhuma tarefa concluída.</EmptyState>
            ) : (
              <div className="grid gap-3">
                {completedTasks.map((task) => {
                  const child = childById.get(task.assignee_id);

                  return (
                    <article className="rounded-md bg-white p-4" key={task.id}>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="font-semibold text-ink">
                            {task.title}
                          </h4>
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
                        <p>{child?.name ?? "Responsável removido"}</p>
                        <p>Prazo: {formatDate(task.deadline)}</p>
                        <p>
                          Conclusão:{" "}
                          {task.completed_at
                            ? formatDate(task.completed_at)
                            : "data não registrada"}
                        </p>
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
              <h2 className="section-title">Membros</h2>
              <p className="text-sm text-stone-600">
                Crie contas de filhos sem sair da sua sessão.
              </p>
            </div>

            <form action={createChildAccount} className="space-y-4">
              <label className="field">
                <span className="label">Nome</span>
                <input
                  className="input"
                  name="name"
                  placeholder="Digite um nome"
                  required
                />
              </label>

              <label className="field">
                <span className="label">E-mail</span>
                <input
                  className="input"
                  name="email"
                  placeholder="Digite um e-mail"
                  type="email"
                  required
                />
              </label>

              <label className="field">
                <span className="label">Senha</span>
                <input
                  className="input"
                  minLength={6}
                  name="password"
                  placeholder="Digite uma senha"
                  type="password"
                  required
                />
              </label>

              <button className="button w-full" type="submit">
                <UserPlus aria-hidden="true" size={16} strokeWidth={2.25} />
                Adicionar filho
              </button>
            </form>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                Filhos
              </h3>

              {children.length === 0 ? (
                <EmptyState>Nenhum filho cadastrado.</EmptyState>
              ) : (
                <div className="grid gap-2">
                  {children.map((child) => (
                    <div
                      className="flex items-center justify-between rounded-md bg-paper px-3 py-2"
                      key={child.id}
                    >
                      <span className="font-medium text-ink">{child.name}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose">
                        <Star aria-hidden="true" size={15} strokeWidth={2.25} />
                        {child.coins} estrelas
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="surface space-y-5">
            <div>
              <h2 className="section-title">Prêmios</h2>
              <p className="text-sm text-stone-600">
                Defina resgates para a loja dos filhos.
              </p>
            </div>

            <form action={createReward} className="space-y-4">
              <label className="field">
                <span className="label">Nome do prêmio</span>
                <input
                  className="input"
                  name="title"
                  placeholder="Ex: 30 min de videogame"
                  required
                />
              </label>

              <label className="field">
                <span className="label">Custo em estrelas</span>
                <input
                  className="input"
                  min={1}
                  name="cost"
                  placeholder="Ex: 5"
                  type="number"
                  required
                />
              </label>

              <button className="button w-full" type="submit">
                <Gift aria-hidden="true" size={16} strokeWidth={2.25} />
                Criar prêmio
              </button>
            </form>

            {rewards.length === 0 ? (
              <EmptyState>Nenhum prêmio criado.</EmptyState>
            ) : (
              <div className="grid gap-2">
                {rewards.map((reward) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-md bg-paper px-3 py-2"
                    key={reward.id}
                  >
                    <div>
                      <span className="font-medium text-ink">
                        {reward.title}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-rose">
                        <Star aria-hidden="true" size={15} strokeWidth={2.25} />
                        {reward.cost} estrelas
                      </span>
                    </div>
                    <form action={deleteReward}>
                      <input name="reward_id" type="hidden" value={reward.id} />
                      <button
                        aria-label={`Excluir prêmio ${reward.title}`}
                        className="button px-3"
                        type="submit"
                      >
                        <Trash2
                          aria-hidden="true"
                          size={16}
                          strokeWidth={2.25}
                        />
                        Excluir
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </main>
    </div>
  );
}
