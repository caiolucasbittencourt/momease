"use client";

import { formatDateTime } from "@/lib/datetime";

type LocalDateTimeTextProps = {
  className?: string;
  value: string;
};

export function LocalDateTimeText({
  className,
  value,
}: LocalDateTimeTextProps) {
  return (
    <time className={className} dateTime={value} suppressHydrationWarning>
      {formatDateTime(value)}
    </time>
  );
}
