/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // You can add custom colors here
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        // Add custom fonts here
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Your custom font sizes
        'xs': ['0.75rem', { lineHeight: '1rem' }], // 12px / 16px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px / 20px
        'base': ['1rem', { lineHeight: '1.5rem' }], // 16px / 24px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px / 28px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px / 28px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px / 32px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px / 36px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px / 40px
        '5xl': ['3rem', { lineHeight: '1' }], // 48px / 48px
        '6xl': ['3.75rem', { lineHeight: '1' }], // 60px / 60px
        '7xl': ['4.5rem', { lineHeight: '1' }], // 72px / 72px
        '8xl': ['6rem', { lineHeight: '1' }], // 96px / 96px
        '9xl': ['8rem', { lineHeight: '1' }], // 128px / 128px
      },
      screens: {
        // Custom breakpoints if needed
        'xs': '475px',
        // Default breakpoints
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      gradientColorStops: {
        'custom-start': '#4338CA', // Customize start color
        'custom-end': '#6D28D9',   // Customize end color
      },
    },
  },
  plugins: [],
  darkMode: 'class', // or 'media' if you prefer system settings
}