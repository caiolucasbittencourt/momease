export function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function formOptionalText(formData: FormData, key: string) {
  const value = formText(formData, key);
  return value.length > 0 ? value : null;
}

export function redirectWithMessage(
  path: string,
  type: "error" | "notice",
  message: string
) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${type}=${encodeURIComponent(message)}`;
}
