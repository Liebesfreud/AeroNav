/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#EBE4D5",
        surface: "#F4EFE6",
        "on-background": "#36312D",
        "on-surface": "#36312D",
        "on-surface-variant": "#716A63",
        primary: "#C3694D",
        "on-primary": "#FFFFFF",
        outline: "#D6D1C1",
        "surface-container": "#E0D7C4",
        "surface-container-low": "#E6E0CF",
        dark: {
          background: '#181716',
          surface: '#252422',
          'surface-elevated': '#302E2C',
          'on-background': '#E2DFD8',
          'on-surface': '#E2DFD8',
          'on-surface-variant': '#9E9A94',
          outline: '#383633',
          'surface-container': '#131110',
          'surface-container-low': '#1E1C1B',
        },
        accent: "#D97757",
        app: {
          discord: '#5865F2',
          twitter: '#1DA1F2',
          github: '#24292e',
          tiktok: '#000000',
          dribbble: '#EA4C89',
          figma: '#F24E1E',
          notion: '#000000',
          bilibili: '#fb7299',
          xiaohongshu: '#ff2442'
        }
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
        xl2: '1.25rem',
        squirle: '24px',
        app: '20px'
      },
      fontFamily: {
        headline: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif']
      },
      boxShadow: {
        card: '0 4px 12px -4px rgba(0, 0, 0, 0.08)',
        glass: '0 4px 12px -4px rgba(0, 0, 0, 0.08)',
        'glass-hover': '0 8px 24px -6px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
