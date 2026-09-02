/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fde6e4',
          200: '#fbd2cf',
          300: '#f7afa9',
          400: '#f08078',
          500: '#e5554d',
          600: '#d23730',
          700: '#b02b25',
          800: '#922723',
          900: '#7a2623',
        },
      },
    },
  },
  plugins: [],
}

