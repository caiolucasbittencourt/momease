import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MomEase",
    template: "%s | MomEase",
  },
  description: "Tarefas, estrelas e recompensas para familias.",
  icons: {
    apple: "/images/logo.svg",
    icon: "/images/logo.svg",
    shortcut: "/images/logo.svg",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
