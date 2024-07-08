module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        accent: '#c07830',
        primary: '#1a202c',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
