/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Keania One', 'sans-serif'],
        'heading': ['Helvetica', 'Arial', 'sans-serif'],
        'body': ['Garamond', 'Times New Roman', 'serif'],
      },
      colors: {
        'doa-black': '#000000',
        'doa-white': '#ffffff',
        'doa-light-gray': '#f5f5f5',
        'doa-gray': '#666666',
        'doa-gold': '#d4af37',
        'doa-gold-light': '#f4e4a6',
        'doa-gold-dark': '#b8941f',
      },
    },
  },
  plugins: [],
}