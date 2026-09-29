import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoSmartNest | Home Automation",
  description: "Explore GoSmartNest home automation for retrofit homes, smart lights, fans, ACs, door locks, sensors, apartments, and commercial spaces.",
  openGraph: { title: "GoSmartNest | Home Automation", description: "Upgrade the home you already have. Explore a more comfortable, connected everyday.", type: "website" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
