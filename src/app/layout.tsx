import type { Metadata } from "next";
import { Keania_One, EB_Garamond } from "next/font/google";
import "./globals.css";
import { FaviconManager } from "@/components/FaviconManager";

// Display font
const keaniaOne = Keania_One({
  weight: "400",
  variable: "--font-keania",
  subsets: ["latin"],
  display: "swap",
});

// Body font (Garamond)
const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
});

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
        className={`${keaniaOne.variable} ${ebGaramond.variable} antialiased`}
      >
        <FaviconManager />
        {children}
      </body>
    </html>
  );
}
