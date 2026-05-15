import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, Mail } from "lucide-react";

import { login } from "@/app/actions/auth";
import { AuthField } from "@/components/AuthField";
import { AuthShell } from "@/components/AuthShell";
import { BrandWordmark } from "@/components/BrandWordmark";
import { MessageBanner } from "@/components/MessageBanner";
import { PendingSubmitButton } from "@/components/PendingSubmitButton";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthShell>
      <section className="space-y-7">
        <div className="-mt-4 text-center sm:-mt-5">
          <BrandWordmark />
        </div>

        <MessageBanner error={params.error} notice={params.notice} />

        <form action={login} className="space-y-5">
          <AuthField
            autoComplete="email"
            icon={Mail}
            label="E-mail"
            name="email"
            placeholder="Digite seu e-mail"
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

          <PendingSubmitButton className="button w-full">
            Entrar
          </PendingSubmitButton>
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
