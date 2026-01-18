import type { Metadata } from "next";
import "./globals.css";
import Providers from "./components/providers";

export const metadata: Metadata = {
  title: "Photography Portfolio",
  description: "A modern photography portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-mono">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
