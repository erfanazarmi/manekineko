import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Maneki Neko",
    default: "Maneki Neko",
  },
  description: "A finance management site for tracking income and expenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
