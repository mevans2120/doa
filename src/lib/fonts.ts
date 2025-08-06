import { Keania_One, EB_Garamond, PT_Sans } from "next/font/google";

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

// Heading font (PT Sans)
const ptSans = PT_Sans({
  weight: ["400", "700"],
  variable: "--font-pt-sans",
  subsets: ["latin"],
  display: "swap",
});

export const fonts = {
  display: keaniaOne.className,
  body: ebGaramond.className,
  heading: 'font-heading', // Helvetica/Arial
};

// Export font instances for use in layout
export { keaniaOne, ebGaramond, ptSans };