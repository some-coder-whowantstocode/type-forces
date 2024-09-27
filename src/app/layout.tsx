import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wordlord",
  description: "A place to practice and show off your typing speed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
