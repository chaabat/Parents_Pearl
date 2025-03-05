/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Option 1: Nurturing & Trustworthy
        primary: {
          light: '#757de8',
          DEFAULT: '#3f51b5',
          dark: '#002984',
        },
        accent: {
          light: '#ff79b0',
          DEFAULT: '#ff4081',
          dark: '#c60055',
        },
        
        // Option 2: Playful & Engaging (uncomment if using this palette)
        /*
        primary: {
          light: '#52c7b8',
          DEFAULT: '#009688',
          dark: '#00675b',
        },
        accent: {
          light: '#ffc947',
          DEFAULT: '#ff9800',
          dark: '#c66900',
        },
        */
      }
    },
  },
  plugins: [],
}