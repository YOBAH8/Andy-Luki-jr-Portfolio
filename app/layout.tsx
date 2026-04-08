import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import "./globals.css";
import Providers from "./components/providers";
import Footer from "./components/Footer";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

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
      <body className={`${greatVibes.variable} antialiased font-mono`}>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
