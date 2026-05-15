"use client";

import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

type PendingSubmitButtonProps = {
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
};

export function PendingSubmitButton({
  children,
  className,
  pendingLabel = "Carregando...",
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-busy={pending}
      className={className}
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <>
          <LoaderCircle
            aria-hidden="true"
            className="animate-spin"
            size={16}
            strokeWidth={2.25}
          />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
