import Link from "next/link";
import { LockKeyhole, Mail } from "lucide-react";

import { login } from "@/app/actions/auth";
import { AuthField } from "@/components/AuthField";
import { AuthShell } from "@/components/AuthShell";
import { BrandWordmark } from "@/components/BrandWordmark";
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
    <AuthShell>
      <section className="space-y-7">
        <div className="space-y-4 text-center">
          <BrandWordmark />
        </div>

        <MessageBanner error={params.error} notice={params.notice} />

        <form action={login} className="space-y-5">
          <AuthField
            autoComplete="email"
            icon={Mail}
            label="E-mail"
            name="email"
            placeholder="Seu e-mail"
            type="email"
          />

          <AuthField
            autoComplete="current-password"
            icon={LockKeyhole}
            label="Senha"
            name="password"
            placeholder="Digite sua senha"
            type="password"
          />

          <button className="button w-full" type="submit">
            Entrar
          </button>
        </form>

        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wide text-stone-400">
          <span className="h-px flex-1 bg-pink-100" />
          ou
          <span className="h-px flex-1 bg-pink-100" />
        </div>

        <Link className="button-secondary w-full" href="/register">
          Cadastre-se gratuitamente
        </Link>
      </section>
    </AuthShell>
  );
}
