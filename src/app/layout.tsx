import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//-----------------------
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
//---------------------------------
export const metadata: Metadata = {
  title: "MyAnimes",
  description: "Nova versão (agora em React, Next.js e TypeScript) do meu site, sobre minha coleção de animes, MyAnimes v3.0.0.",
};
//=======================================================================================
export default function RootLayout({ children }: Readonly<{children:React.ReactNode;}>) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
};
