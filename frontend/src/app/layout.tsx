import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BADM 550 | Course Operating System",
  description: "AI-powered course management for MSBA Business Practicum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="animate-fade-in">
        {children}
      </body>
    </html>
  );
}

