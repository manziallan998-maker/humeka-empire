/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: '#0B0F0E',
          900: '#111613',
          800: '#181F1B',
          700: '#232C26'
        },
        grass: {
          400: '#3FCB6E',
          500: '#1F9D55',
          600: '#157A41'
        },
        whistle: {
          400: '#F7CB45',
          500: '#F2B705',
          600: '#C99300'
        },
        chalk: {
          100: '#F5F5F0',
          300: '#C9CFC9',
          500: '#8B9490'
        }
      },
      fontFamily: {
        display: ['Anton', 'Oswald', 'sans-serif'],
        body: ['"Work Sans"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
