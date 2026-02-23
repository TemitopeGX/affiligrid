import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AFFILIGRID Brand Colors
        brand: {
          'dark-blue': '#111457',
          'vivid-orange': '#FF6600',
        },
        // Extended Dark Blue Palette
        'dark-blue': {
          50: '#E8E9F5',
          100: '#C5C7E8',
          200: '#9FA2DA',
          300: '#787DCC',
          400: '#5A61C1',
          500: '#3C45B6',
          600: '#111457', // Primary
          700: '#0D0F3F',
          800: '#090B2A',
          900: '#050615',
        },
        // Extended Orange Palette
        orange: {
          50: '#FFF3E6',
          100: '#FFE0C2',
          200: '#FFCC99',
          300: '#FFB870',
          400: '#FFA347',
          500: '#FF8F1F',
          600: '#FF6600', // Primary
          700: '#E65C00',
          800: '#CC5200',
          900: '#B34700',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
