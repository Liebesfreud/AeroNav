/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#F9F8F6",
        surface: "#FFFFFF",
        "on-background": "#2F3331",
        "on-surface": "#2F3331",
        "on-surface-variant": "#6D726F",
        primary: "#99462A",
        "on-primary": "#FFFFFF",
        outline: "#E5E7EB",
        "surface-container": "#F3F4F1",
        "surface-container-low": "#FAF9F7",
        dark: {
          background: '#111315',
          surface: '#171A1D',
          'surface-elevated': '#1F2328',
          'on-background': '#F5F7F5',
          'on-surface': '#F3F5F3',
          'on-surface-variant': '#A1A8A4',
          outline: '#31363B',
          'surface-container': '#22272B',
          'surface-container-low': '#1A1E22',
        },
        accent: "#d97757",
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
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
        xl2: '1.25rem',
        squirle: '32px',
        app: '28px'
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"]
      },
      boxShadow: {
        card: '0 10px 30px -18px rgba(15, 23, 42, 0.25)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
