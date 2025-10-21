import type { Metadata } from "next";
import "./globals.css";
import { FaviconManager } from "@/components/FaviconManager";
import { ConsoleSuppress } from "@/components/ConsoleSuppress";
import { ebGaramond, ptSans, bebasNeue } from "@/lib/fonts";
import { getSiteMetadata } from "@/lib/metadata";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { Analytics } from "@vercel/analytics/next";

// Revalidate every 5 minutes as fallback (webhooks will trigger instant updates)
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata();

  // Don't set static favicon here - let FaviconManager handle it dynamically
  return {
    ...metadata,
    manifest: '/manifest.json',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          as="image"
          href="/doa-logo.png"
          fetchPriority="high"
        />

        {/* Preconnect to Google Fonts - CRITICAL for font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preconnect to Sanity CDN - CRITICAL for LCP */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* Preconnect to Vercel's CDN */}
        <link rel="preconnect" href="https://vercel.app" />
        <link rel="preconnect" href="https://doa-sable.vercel.app" crossOrigin="anonymous" />
      </head>
      <body
        className={`${ebGaramond.variable} ${ptSans.variable} ${bebasNeue.variable} antialiased overflow-x-hidden`}
      >
        <FaviconManager />
        <ConsoleSuppress />
        <SiteSettingsProvider>
          {children}
        </SiteSettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}