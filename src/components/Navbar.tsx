import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-gray-800 bg-gradient-to-b from-gray-950 to-gray-950/80 px-6 backdrop-blur-md">
      <div className="ml-auto">
        <Image
          src="/digitalnova-logo.png"
          alt="DigitalNova Studio"
          width={160}
          height={46}
          priority
        />
      </div>
    </nav>
  );
}
