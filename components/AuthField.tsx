import type { LucideIcon } from "lucide-react";

type AuthFieldProps = {
  autoComplete: string;
  icon: LucideIcon;
  label: string;
  minLength?: number;
  name: string;
  placeholder?: string;
  type: string;
};

export function AuthField({
  autoComplete,
  icon: Icon,
  label,
  minLength,
  name,
  placeholder,
  type
}: AuthFieldProps) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <span className="flex overflow-hidden rounded-md border border-pink-100 bg-slate-100 transition focus-within:border-rose focus-within:ring-2 focus-within:ring-rose/20">
        <input
          autoComplete={autoComplete}
          className="min-h-11 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-stone-950 outline-none placeholder:text-stone-400"
          minLength={minLength}
          name={name}
          placeholder={placeholder}
          required
          type={type}
        />
        <span className="flex min-h-11 w-12 shrink-0 items-center justify-center bg-rose text-white">
          <Icon aria-hidden="true" size={17} strokeWidth={2.25} />
        </span>
      </span>
    </label>
  );
}
