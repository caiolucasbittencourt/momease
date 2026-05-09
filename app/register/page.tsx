import Link from "next/link";

import { registerMother } from "@/app/actions/auth";
import { MessageBanner } from "@/components/MessageBanner";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">
            MomEase
          </p>
          <h1 className="text-3xl font-bold text-ink">Cadastro da mãe</h1>
          <p className="text-sm text-stone-600">
            O cadastro cria uma família nova automaticamente.
          </p>
        </div>

        <MessageBanner error={params.error} notice={params.notice} />

        <form action={registerMother} className="surface space-y-4">
          <label className="field">
            <span className="label">Nome</span>
            <input
              className="input"
              name="name"
              type="text"
              autoComplete="name"
              required
            />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input
              className="input"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span className="label">Senha</span>
            <input
              className="input"
              name="password"
              type="password"
              minLength={6}
              autoComplete="new-password"
              required
            />
          </label>

          <button className="button w-full" type="submit">
            Criar conta
          </button>
        </form>

        <p className="text-center text-sm text-stone-600">
          Já tem cadastro?{" "}
          <Link className="font-semibold text-leaf hover:underline" href="/login">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
