import type { Metadata } from "next";
import "./globals.css";
import {JetBrains_Mono } from "next/font/google"

export const metadata: Metadata = {
  title: "My Portfolio",
};

const jetbrainsMono = JetBrains_Mono({subsets: ["latin"], variable: "--font-jetbrains-mono"})

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.variable}>{children}</body>
    </html>
  );
}
