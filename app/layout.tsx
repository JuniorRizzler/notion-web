import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyConcept",
  description: "A connected workspace for learning, understanding, and building knowledge.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/studyconcept-logo-static-blue.svg", type: "image/svg+xml" }
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
