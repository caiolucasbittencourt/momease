import Image from "next/image";
import { AppFooter } from "@/components/AppFooter";

type AuthShellProps = {
  children: React.ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[minmax(23rem,30rem)_1fr]">
      <section className="flex min-h-screen bg-white px-6 py-10 sm:px-10 lg:px-12">
        <div className="mx-auto flex min-h-full w-full max-w-sm flex-col">
          <div className="flex flex-1 items-center">
            <div className="w-full">{children}</div>
          </div>
          <AppFooter variant="auth" />
        </div>
      </section>

      <section className="hidden min-h-screen items-center justify-center bg-[#d94f8a] px-10 py-12 lg:flex">
        <Image
          alt="Ilustração de organização familiar"
          className="max-h-[72vh] w-full max-w-xl object-contain"
          height={752}
          priority
          src="/images/dreamer.svg"
          width={1018}
        />
      </section>
    </main>
  );
}
