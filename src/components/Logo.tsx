import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Image
      src="/digitalnova-logo.png"
      alt="DigitalNova Studio"
      width={280}
      height={80}
      priority
      className={className}
    />
  );
}
