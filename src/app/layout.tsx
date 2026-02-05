import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Navbar } from "~/components/Navbar";

export const metadata: Metadata = {
  title: "AgencyForms — DigitalNova Studio",
  description:
    "Securely collect and deliver client credentials. Password-protected, never stored online.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  robots: { index: false, follow: false },
  openGraph: {
    title: "AgencyForms — DigitalNova Studio",
    description: "Secure client credential collection for agency onboarding.",
    type: "website",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="pt-16">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
