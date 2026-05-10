import { logout } from "@/app/actions/auth";
import { BrandWordmark } from "@/components/BrandWordmark";
import { LogOut } from "lucide-react";

type DashboardHeaderProps = {
  name: string;
  roleLabel?: string;
  aside?: React.ReactNode;
};

export function DashboardHeader({
  name,
  roleLabel,
  aside
}: DashboardHeaderProps) {
  return (
    <header className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <BrandWordmark compact />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-ink sm:text-3xl">{name}</h1>
            {roleLabel ? (
              <p className="text-sm text-stone-600">{roleLabel}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {aside}
          <form action={logout}>
            <button className="button" type="submit">
              <LogOut aria-hidden="true" size={16} strokeWidth={2.25} />
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
