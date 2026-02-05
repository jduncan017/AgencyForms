import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-gray-800 bg-gradient-to-r from-slate-900 to-slate-950 px-6">
      <Image
        src="/digitalnova-logo.png"
        alt="DigitalNova Studio"
        width={180}
        height={52}
        priority
      />
    </nav>
  );
}
