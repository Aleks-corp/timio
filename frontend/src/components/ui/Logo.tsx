import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

// Exported directly from the "Logo" node on the Figma "Sign up" frame
// (file ZwJVYgJwsCUR82VAUxHoS3, node 158:4586) — real vector asset, not redrawn.
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
