import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

type BrandWordmarkProps = {
  compact?: boolean;
};

export function BrandWordmark({ compact = false }: BrandWordmarkProps) {
  const containerClassName = compact
    ? "inline-flex items-baseline leading-none"
    : "mx-auto inline-flex items-baseline leading-none";
  const textClassName = compact
    ? "text-[1.65rem] tracking-[-0.06em] sm:text-[1.9rem]"
    : "text-[3rem] tracking-[-0.08em] sm:text-[4rem]";

  return (
    <div className={containerClassName}>
      <span
        className={`${quicksand.className} ${textClassName} font-bold text-rose`}
      >
        mom
      </span>
      <span
        className={`${quicksand.className} ${textClassName} font-bold text-berry`}
      >
        ease
      </span>
    </div>
  );
}
