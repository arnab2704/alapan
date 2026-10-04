import Image from "next/image";

/** The Alapon mark: a lotus-leaf spray in Bengal red and gold. Decorative; the wordmark carries the name. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <Image
      src="/images/brand/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={256}
      height={256}
      className={`${className} object-contain`}
    />
  );
}
