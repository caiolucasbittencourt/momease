import Image from "next/image";

type BrandWordmarkProps = {
  compact?: boolean;
};

export function BrandWordmark({ compact = false }: BrandWordmarkProps) {
  const widthClassName = compact
    ? "w-16 sm:w-[4.5rem]"
    : "mx-auto w-24 sm:w-36";

  return (
    <div className={widthClassName}>
      <Image
        alt="MomEase"
        className="h-auto w-full"
        height={1500}
        priority={!compact}
        sizes={
          compact
            ? "(min-width: 640px) 72px, 64px"
            : "(min-width: 640px) 144px, 96px"
        }
        src="/images/logo.svg"
        width={1500}
      />
    </div>
  );
}
