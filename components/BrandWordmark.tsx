import { Grand_Hotel } from "next/font/google";

const grandHotel = Grand_Hotel({
  display: "swap",
  subsets: ["latin"],
  weight: "400"
});

type BrandWordmarkProps = {
  compact?: boolean;
};

export function BrandWordmark({ compact = false }: BrandWordmarkProps) {
  return (
    <p
      aria-label="MomEase"
      className={`${grandHotel.className} leading-none text-rose ${
        compact ? "text-5xl" : "text-6xl"
      }`}
    >
      momease
    </p>
  );
}
