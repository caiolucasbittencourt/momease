const DATETIME_LOCAL_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function formatDateTime(value: string, locale = "pt-BR") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function parseDateTimeLocal(
  value: string,
  timezoneOffsetMinutesRaw?: string | null,
) {
  const match = DATETIME_LOCAL_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const [, yearRaw, monthRaw, dayRaw, hourRaw, minuteRaw, secondRaw] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const second = Number(secondRaw ?? "0");
  const baseTimestamp = Date.UTC(year, month - 1, day, hour, minute, second);
  const baseDate = new Date(baseTimestamp);

  if (
    baseDate.getUTCFullYear() !== year ||
    baseDate.getUTCMonth() !== month - 1 ||
    baseDate.getUTCDate() !== day ||
    baseDate.getUTCHours() !== hour ||
    baseDate.getUTCMinutes() !== minute ||
    baseDate.getUTCSeconds() !== second
  ) {
    return null;
  }

  const timezoneOffsetMinutes = Number(timezoneOffsetMinutesRaw);

  if (!Number.isInteger(timezoneOffsetMinutes)) {
    const fallbackDate = new Date(value);

    return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
  }

  return new Date(baseTimestamp + timezoneOffsetMinutes * 60_000);
}
