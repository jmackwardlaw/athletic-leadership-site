/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Racesport', 'Barlow Condensed', 'sans-serif'],
        headline: ['Barlow Condensed', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#d81300',
          'red-hover': '#ff1a00',
        },
        surface: {
          base: '#1c1c1c',
          raised: '#232323',
          card: '#2a2a2a',
          'card-hover': '#313131',
          overlay: '#333333',
          sunken: '#141414',
          light: '#f5f5f4',
          'light-raised': '#ffffff',
        },
        ink: {
          primary: '#f5f5f4',
          secondary: '#c4c4c4',
          muted: '#8a8a8a',
          faint: '#5a5a5a',
          'on-light': '#1a1a1a',
          'on-light-muted': '#5a5a5a',
        },
      },
      borderRadius: {
        token: '8px',
      },
      boxShadow: {
        red: '0 8px 28px rgba(216, 19, 0, 0.28)',
        elevated: '0 14px 40px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
