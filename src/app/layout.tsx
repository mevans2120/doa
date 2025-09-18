import type { Metadata } from "next";
import "./globals.css";
import { FaviconManager } from "@/components/FaviconManager";
import { keaniaOne, ebGaramond, ptSans, bebasNeue } from "@/lib/fonts";
import { getSiteMetadata } from "@/lib/metadata";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata();
  
  // Add favicon configuration to the metadata
  return {
    ...metadata,
    icons: {
      icon: '/skull.svg',
      shortcut: '/skull.svg',
      apple: '/skull.svg',
    },
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
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        
        {/* Preconnect to Vercel's CDN */}
        <link rel="preconnect" href="https://vercel.app" />
        <link rel="preconnect" href="https://doa-sable.vercel.app" crossOrigin="anonymous" />
      </head>
      <body
        className={`${keaniaOne.variable} ${ebGaramond.variable} ${ptSans.variable} ${bebasNeue.variable} antialiased overflow-x-hidden`}
      >
        <FaviconManager />
        <SiteSettingsProvider>
          {children}
        </SiteSettingsProvider>
      </body>
    </html>
  );
}