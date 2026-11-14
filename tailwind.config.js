/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#07090D', // Deepest night canvas
          900: '#0E1117', // Night backdrop
          850: '#141822', // Night card surface
          800: '#1A202E', // Night secondary surface
          750: '#222B3D', // Night elevated component
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
        },
        day: {
          950: '#FFFFFF', // Pure light surface
          900: '#F5F7FA', // Primary day background
          850: '#EDF1F5', // Soft silver day canvas
          800: '#E2E8F0', // Border / secondary card
          700: '#CBD5E1',
          border: 'rgba(0, 0, 0, 0.08)',
          borderHover: 'rgba(0, 0, 0, 0.16)',
          text: '#0F172A',
          textMuted: '#64748B',
        },
        porsche: {
          carmine: '#D5001C', // Iconic Porsche Carmine Red
          carmineHover: '#B80018',
          carmineMuted: 'rgba(213, 0, 28, 0.12)',
          acid: '#94E000',    // Electric Acid Green accent
          acidMuted: 'rgba(148, 224, 0, 0.12)',
          silver: '#E2E8F0',
          titanium: '#94A3B8',
          graphite: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'studio-card': '0 4px 24px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'day-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }
    },
  },
  plugins: [],
}
