import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyConcept",
  description: "A connected workspace for learning, understanding, and building knowledge.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/studyconcept-logo-animated.svg?v=original-flame-1", type: "image/svg+xml" },
      { url: "/brand/studyconcept-flame-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
