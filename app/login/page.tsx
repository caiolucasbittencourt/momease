import Link from "next/link";

import { login } from "@/app/actions/auth";
import { MessageBanner } from "@/components/MessageBanner";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">
            MomEase
          </p>
          <h1 className="text-3xl font-bold text-ink">Entrar</h1>
          <p className="text-sm text-stone-600">
            Acesso único para mães e filhos.
          </p>
        </div>

        <MessageBanner error={params.error} notice={params.notice} />

        <form action={login} className="surface space-y-4">
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
              autoComplete="current-password"
              required
            />
          </label>

          <button className="button w-full" type="submit">
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-stone-600">
          Mãe nova no MomEase?{" "}
          <Link className="font-semibold text-leaf hover:underline" href="/register">
            Criar cadastro
          </Link>
        </p>
      </section>
    </main>
  );
}
