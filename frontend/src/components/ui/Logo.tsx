import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 64, className }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Timio"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
