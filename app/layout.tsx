import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MomEase",
    template: "%s | MomEase",
  },
  description: "Tarefas, estrelas e recompensas para familias.",
  icons: {
    apple: "/images/favicon.png",
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
