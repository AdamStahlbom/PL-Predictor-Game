import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premier League Tips",
  description: "Tippa PL med vännerna",
  openGraph: {
    title: "PL Tips",
    description: "Tippa Premier League med dina vänner!",
    url: "https://adamstahlbom.se",
    siteName: "PL Tips",
    locale: "sv_SE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        <Navbar /> {/* <-- Lägg till högst upp i body */}
        {children}
      </body>
    </html>
  );
}
