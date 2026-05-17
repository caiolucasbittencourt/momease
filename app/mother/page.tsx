import type { Metadata } from "next";
import {
  createChildAccount,
  createReward,
  createTask,
  deleteReward,
} from "@/app/actions/mother";
import { AppFooter } from "@/components/AppFooter";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmptyState } from "@/components/EmptyState";
import { LocalDateTimeInput } from "@/components/LocalDateTimeInput";
import { LocalDateTimeText } from "@/components/LocalDateTimeText";
import { MessageBanner } from "@/components/MessageBanner";
import { requireProfile } from "@/lib/auth";
import type { Profile, Reward, Task } from "@/lib/types";
import {
  CheckCircle2,
  Clock3,
  Gift,
  Plus,
  Star,
  Target,
  Trash2,
  UserPlus,
} from "lucide-react";

type MotherPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: {
    absolute: "Dashboard | MomEase",
  },
};

const taskSuggestions = [
  "Lavar louça",
  "Arrumar cama",
  "Guardar brinquedos",
  "Fazer dever de casa",
  "Organizar mochila",
];

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
  const totalFamilyStars = children.reduce(
    (total, child) => total + child.coins,
    0,
  );
  const totalTrackedTasks = tasks.length + completedTasks.length;
  const completionRate = totalTrackedTasks === 0
    ? 0
    : Math.round((completedTasks.length / totalTrackedTasks) * 100);
  const summaryCards = [
    {
      title: "Tarefas concluídas",
      value: completedTasks.length,
      detail:
        completedTasks.length === 1
          ? "1 tarefa finalizada pela família"
          : `${completedTasks.length} tarefas finalizadas pela família`,
      icon: CheckCircle2,
      accentClass: "bg-emerald-100 text-emerald-700",
      valueClass: "text-emerald-700",
    },
    {
      title: "Tarefas pendentes",
      value: tasks.length,
      detail:
        tasks.length === 0
          ? "Nenhuma tarefa aguardando ação"
          : `${tasks.length} ${tasks.length === 1 ? "tarefa aguardando ação" : "tarefas aguardando ação"}`,
      icon: Clock3,
      accentClass: "bg-sky-100 text-sky-700",
      valueClass: "text-sky-700",
    },
    {
      title: "Estrelas da família",
      value: totalFamilyStars,
      detail:
        children.length === 0
          ? "Adicione filhos para começar a acumular estrelas"
          : `${children.length} ${children.length === 1 ? "filho somando estrelas" : "filhos somando estrelas"}`,
      icon: Star,
      accentClass: "bg-yellow-100 text-yellow-700",
      valueClass: "text-yellow-700",
    },
    {
      title: "Taxa de conclusão",
      value: `${completionRate}%`,
      detail:
        totalTrackedTasks === 0
          ? "Ainda não há tarefas registradas"
          : `Baseada em ${totalTrackedTasks} ${totalTrackedTasks === 1 ? "tarefa registrada" : "tarefas registradas"}`,
      icon: Target,
      accentClass: "bg-violet-100 text-violet-700",
      valueClass: "text-violet-700",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#d94f8a]">
      <DashboardHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6">
        <MessageBanner error={params.error} notice={params.notice} />

        <section className="surface space-y-5">
          <div>
            <h2 className="section-title">Resumo da família</h2>
            <p className="text-sm text-stone-600">
              Veja rapidamente o andamento das tarefas e das estrelas.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  className="rounded-xl border border-pink-100 bg-gradient-to-br from-white via-white to-rose-50 p-4"
                  key={card.title}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-stone-500">
                      {card.title}
                    </p>
                    <div className={`rounded-full p-2 ${card.accentClass}`}>
                      <Icon aria-hidden="true" size={18} strokeWidth={2.25} />
                    </div>
                  </div>
                  <p className={`mt-3 text-3xl font-bold ${card.valueClass}`}>
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm text-stone-600">{card.detail}</p>
                </article>
              );
            })}
          </div>

        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
          <div className="space-y-6">
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
                    placeholder="Ex: Lavar a louça"
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
                  <LocalDateTimeInput
                    className="input"
                    name="deadline"
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
                            <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                              Pendente
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-stone-600">
                            {child?.name ?? "Responsável removido"} -{" "}
                            <LocalDateTimeText value={task.deadline} />
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
                          <p>
                            Prazo: <LocalDateTimeText value={task.deadline} />
                          </p>
                          <p>
                            Conclusão:{" "}
                            {task.completed_at
                              ? (
                                  <LocalDateTimeText value={task.completed_at} />
                                )
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
                  Adicionar filho(a)
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
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-700">
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
                        <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-yellow-700">
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
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
