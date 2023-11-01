// Paths to the files that will use Tailwind CSS class names:

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'    
  ],
  theme: {
    extend: {
      backgroundImage:{
        'atari-flashback-classics':"url('/platforms/afc-logo.png')",
        'nes':"url('/platforms/NES_logo.svg')"
      }
    },
  },
  plugins: [require("daisyui")],
}