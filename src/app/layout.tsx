import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <-- Importera här

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premier League Tips",
  description: "Tippa PL med vännerna",
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
