import { EB_Garamond, PT_Sans, Bebas_Neue } from "next/font/google";

// Body font (Garamond)
const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
});

// Heading font (PT Sans)
const ptSans = PT_Sans({
  weight: ["400", "700"],
  variable: "--font-pt-sans",
  subsets: ["latin"],
  display: "swap",
});

// Bebas Neue font - CRITICAL for LCP element
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const fonts = {
  body: ebGaramond.className,
  heading: 'font-heading',
};

// Export font instances for use in layout
export { ebGaramond, ptSans, bebasNeue };