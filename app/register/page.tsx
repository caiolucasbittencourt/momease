import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, Mail, User } from "lucide-react";

import { registerMother } from "@/app/actions/auth";
import { AuthField } from "@/components/AuthField";
import { AuthShell } from "@/components/AuthShell";
import { BrandWordmark } from "@/components/BrandWordmark";
import { MessageBanner } from "@/components/MessageBanner";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Cadastro",
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;

  return (
    <AuthShell>
      <section className="space-y-7">
        <div className="-mt-4 text-center sm:-mt-5">
          <BrandWordmark />
        </div>

        <MessageBanner error={params.error} notice={params.notice} />

        <form action={registerMother} className="space-y-5">
          <AuthField
            autoComplete="name"
            icon={User}
            label="Nome"
            name="name"
            placeholder="Digite seu nome"
            type="text"
          />

          <AuthField
            autoComplete="email"
            icon={Mail}
            label="E-mail"
            name="email"
            placeholder="Digite seu e-mail"
            type="email"
          />

          <AuthField
            autoComplete="new-password"
            icon={LockKeyhole}
            label="Senha"
            minLength={6}
            name="password"
            placeholder="Crie uma senha"
            type="password"
          />

          <button className="button w-full" type="submit">
            Cadastrar-se
          </button>
        </form>

        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wide text-stone-400">
          <span className="h-px flex-1 bg-pink-100" />
          ou
          <span className="h-px flex-1 bg-pink-100" />
        </div>

        <Link className="button-secondary w-full" href="/login">
          Entrar
        </Link>
      </section>
    </AuthShell>
  );
}
