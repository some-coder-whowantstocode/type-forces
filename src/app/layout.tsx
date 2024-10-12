import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "type-forces",
  description: "Practice and get better",
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
