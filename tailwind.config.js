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
        'display': ['var(--font-keania)', 'Keania One', 'sans-serif'],
        'heading': ['var(--font-pt-sans)', 'PT Sans', 'sans-serif'],
        'body': ['var(--font-garamond)', 'Garamond', 'Times New Roman', 'serif'],
      },
      colors: {
        'doa-black': '#121212',
        'doa-white': '#ffffff',
        'doa-light-gray': '#f5f5f5',
        'doa-gray': '#666666',
        'doa-silver': '#c0c0c0',  // Renamed from doa-gold
        'doa-silver-light': '#e0e0e0',  // Renamed from doa-gold-light
        'doa-silver-dark': '#a0a0a0',  // Renamed from doa-gold-dark
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'gradient-x': 'gradient-shift 20s ease infinite',
        'gradient-x-reverse': 'gradient-shift-reverse 20s ease infinite',
        'hero-pulse': 'hero-pulse 8s ease-in-out infinite',
        'hero-fade-in': 'heroFadeIn 0.8s ease-out forwards',
        'hero-fade-in-delay-1': 'heroFadeIn 0.8s ease-out 0.3s forwards',
        'hero-fade-in-delay-2': 'heroFadeIn 0.8s ease-out 0.6s forwards',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeIn: {
          'from': {
            opacity: '0'
          },
          'to': {
            opacity: '1'
          }
        },
        heroFadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideIn: {
          'from': {
            transform: 'translateX(-20px)',
            opacity: '0'
          },
          'to': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'gradient-shift': {
          '0%, 100%': {
            'background-position': '0% 50%',
            'transform': 'translateZ(0)'
          },
          '50%': {
            'background-position': '100% 50%',
            'transform': 'translateZ(0)'
          }
        },
        'gradient-shift-reverse': {
          '0%, 100%': {
            'background-position': '100% 50%',
            'transform': 'translateZ(0)'
          },
          '50%': {
            'background-position': '0% 50%',
            'transform': 'translateZ(0)'
          }
        },
        'hero-pulse': {
          '0%, 100%': {
            transform: 'scale(1.15)'
          },
          '50%': {
            transform: 'scale(1)'
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}