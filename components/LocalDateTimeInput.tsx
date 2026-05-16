"use client";

import type { ChangeEvent, ComponentPropsWithoutRef } from "react";
import { useEffect, useRef, useState } from "react";

type LocalDateTimeInputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  name: string;
  offsetName?: string;
};

function getTimezoneOffsetMinutes(value: string) {
  if (!value) {
    return "";
  }

  const localDate = new Date(value);

  return Number.isNaN(localDate.getTime())
    ? ""
    : String(localDate.getTimezoneOffset());
}

export function LocalDateTimeInput({
  name,
  offsetName = `${name}_timezone_offset`,
  onChange,
  ...props
}: LocalDateTimeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [offsetMinutes, setOffsetMinutes] = useState("");

  useEffect(() => {
    setOffsetMinutes(getTimezoneOffsetMinutes(inputRef.current?.value ?? ""));
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setOffsetMinutes(getTimezoneOffsetMinutes(event.target.value));
    onChange?.(event);
  }

  return (
    <>
      <input
        {...props}
        name={name}
        onChange={handleChange}
        ref={inputRef}
        type="datetime-local"
      />
      <input name={offsetName} type="hidden" value={offsetMinutes} />
    </>
  );
}
