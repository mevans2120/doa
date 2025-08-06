import type { Metadata } from "next";
import "./globals.css";
import { FaviconManager } from "@/components/FaviconManager";
import { keaniaOne, ebGaramond, ptSans } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL('https://departmentofart.com'),
  title: "Department of Art",
  description: "Professional set construction services for the entertainment industry",
  icons: {
    icon: '/skull.svg',
    shortcut: '/skull.svg',
    apple: '/skull.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Department of Art",
    description: "Professional set construction services for the entertainment industry",
    url: 'https://departmentofart.com',
    siteName: 'Department of Art',
    images: [
      {
        url: '/social-image.png',
        width: 1200,
        height: 630,
        alt: 'Department of Art - Professional Set Construction',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Department of Art',
    description: 'Professional set construction services for the entertainment industry',
    images: ['/social-image.png'],
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
        className={`${keaniaOne.variable} ${ebGaramond.variable} ${ptSans.variable} antialiased`}
      >
        <FaviconManager />
        {children}
      </body>
    </html>
  );
}
