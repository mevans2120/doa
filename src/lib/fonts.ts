import { Keania_One, EB_Garamond } from "next/font/google";

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

export const fonts = {
  display: keaniaOne.className,
  body: ebGaramond.className,
  heading: 'font-heading', // Helvetica/Arial
};