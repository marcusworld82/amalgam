import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amalgam — Your Daily Ritual",
  description: "Every dose, every day. Held together."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
