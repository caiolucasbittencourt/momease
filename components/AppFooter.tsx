type AppFooterProps = {
  variant?: "auth" | "dashboard";
};

export function AppFooter({ variant = "dashboard" }: AppFooterProps) {
  if (variant === "auth") {
    return (
      <footer className="pt-5">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            &copy; 2026 momease
          </p>
          <p className="text-sm text-stone-600">
            Tarefas, estrelas e recompensas para uma rotina mais leve.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          &copy; 2026 momease
        </p>
        <p className="text-sm text-stone-600">
          Tarefas, estrelas e recompensas para uma rotina mais leve.
        </p>
      </div>
    </footer>
  );
}
