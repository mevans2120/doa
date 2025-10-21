import { EB_Garamond, PT_Sans, Bebas_Neue } from "next/font/google";

// Body font (Garamond) - Not used in LCP, load after initial render
const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Heading font (PT Sans) - Not used in LCP, load after initial render
const ptSans = PT_Sans({
  weight: ["400", "700"],
  variable: "--font-pt-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Bebas Neue font - CRITICAL for LCP element
// Using 'optional' display to prevent render blocking
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "optional",
  preload: true,
  adjustFontFallback: true,
});

export const fonts = {
  body: ebGaramond.className,
  heading: 'font-heading',
};

// Export font instances for use in layout
export { ebGaramond, ptSans, bebasNeue };