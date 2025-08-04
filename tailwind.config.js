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
        'display': ['var(--font-keania-one)', 'Keania One', 'sans-serif'],
        'heading': ['Helvetica', 'Arial', 'sans-serif'],
        'body': ['Garamond', 'Times New Roman', 'serif'],
      },
      colors: {
        'doa-black': '#000000',
        'doa-white': '#ffffff',
        'doa-light-gray': '#f5f5f5',
        'doa-gray': '#666666',
        'doa-gold': '#c0c0c0',
        'doa-gold-light': '#e0e0e0',
        'doa-gold-dark': '#a0a0a0',
      },
    },
  },
  plugins: [],
}