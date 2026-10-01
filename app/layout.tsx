import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guilherme de Morais",
  description: "Software Engineering, Systems, Security and Automation.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
