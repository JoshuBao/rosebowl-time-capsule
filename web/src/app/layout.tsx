import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";

const crimsonPro = Crimson_Pro({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rose Bowl Time Capsule",
  description:
    "A living, crowd-sourced archive of where people were and what they felt during the Rose Parade / Rose Bowl.",
  openGraph: {
    title: "Rose Bowl Time Capsule",
    description:
      "A living, crowd-sourced archive of where people were and what they felt during the Rose Parade / Rose Bowl.",
    images: [
      {
        url: "/social.png",
        width: 1200,
        height: 630,
        alt: "Rose Bowl Time Capsule",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rose Bowl Time Capsule",
    description:
      "A living, crowd-sourced archive of where people were and what they felt during the Rose Parade / Rose Bowl.",
    images: ["/social.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${crimsonPro.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
