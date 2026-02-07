/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#39A900', // Verde SENA principal
          600: '#007832', // Verde oscuro SENA
          700: '#00602a',
          800: '#004d22',
          900: '#003d1b',
        },
        sena: {
          verde: '#39A900',
          amarillo: '#FDC300',
          violeta: '#71277A',
          azul: '#00304D',
          cyan: '#50E5F9',
          verdeOscuro: '#007832',
        }
      },
    },
  },
  plugins: [],
}