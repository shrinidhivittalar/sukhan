import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Sukhan · Urdu Poetry Studio",
    description: "Ten interactive Urdu poetry levels with guided study, activities, quizzes, listening and in-page source guides.",
    openGraph: {
      title: "Sukhan · Urdu Poetry Studio",
      description: "Read the word. Hear the poem. Keep what stays.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1731, height: 909, alt: "Sukhan Urdu Poetry Studio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sukhan · Urdu Poetry Studio",
      description: "Read the word. Hear the poem. Keep what stays.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
