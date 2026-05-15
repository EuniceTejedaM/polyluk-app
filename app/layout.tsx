import type { Metadata } from "next";
import { Alegreya_Sans, Fraunces } from "next/font/google";
import AppShell from "./components/AppShell";
import "./globals.css";

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Alegreya_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Polyluk | Monitoreo biosensorial para perros",
  description:
    "Aplicación móvil de monitoreo biosensorial para perros con datos simulados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
