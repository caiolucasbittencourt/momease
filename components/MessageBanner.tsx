"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

type MessageBannerProps = {
  error?: string | string[];
  notice?: string | string[];
};

function firstMessage(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function MessageBanner({ error, notice }: MessageBannerProps) {
  const errorMessage = firstMessage(error);
  const noticeMessage = firstMessage(notice);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsDismissed(false);
  }, [errorMessage, noticeMessage]);

  if ((!errorMessage && !noticeMessage) || isDismissed) {
    return null;
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
        <p className="flex-1">{errorMessage}</p>
        <button
          aria-label="Fechar aviso"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-current opacity-70 transition hover:opacity-100"
          onClick={() => setIsDismissed(true)}
          type="button"
        >
          <X aria-hidden="true" size={16} strokeWidth={2.25} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-rose/20 bg-blush px-4 py-3 text-sm font-medium text-berry">
      <p className="flex-1">{noticeMessage}</p>
      <button
        aria-label="Fechar aviso"
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-current opacity-70 transition hover:opacity-100"
        onClick={() => setIsDismissed(true)}
        type="button"
      >
        <X aria-hidden="true" size={16} strokeWidth={2.25} />
      </button>
    </div>
  );
}
