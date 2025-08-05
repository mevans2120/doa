import type { Metadata } from "next";
import { Keania_One, EB_Garamond } from "next/font/google";
import "./globals.css";

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
  title: "Department of Art",
  description: "Professional set construction services for the entertainment industry",
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
        {children}
      </body>
    </html>
  );
}
