import Image from "next/image";

type BrandWordmarkProps = {
  compact?: boolean;
};

export function BrandWordmark({ compact = false }: BrandWordmarkProps) {
  const widthClassName = compact
    ? "w-[4.5rem] sm:w-20"
    : "mx-auto w-28 sm:w-40";

  return (
    <div className={widthClassName}>
      <Image
        alt="MomEase"
        className="h-auto w-full"
        height={1500}
        priority={!compact}
        sizes={
          compact
            ? "(min-width: 640px) 80px, 72px"
            : "(min-width: 640px) 160px, 112px"
        }
        src="/images/logo.svg"
        width={1500}
      />
    </div>
  );
}
