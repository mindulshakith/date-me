module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: { 100: '#fde8f0', 200: '#fbc8db', 300: '#f7a0bf', 400: '#f278a3', 500: '#e8558a' },
        cream: { 50: '#fdf8f3', 100: '#faeee3', 200: '#f4dac8' },
        lavender: { 100: '#ede8f7', 200: '#d8cef0', 300: '#c0b0e8', 400: '#a08ed8', 500: '#7c65c0' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Lato"', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
    },
  },
  plugins: [],
};
