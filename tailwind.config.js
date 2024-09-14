/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bouceHorizontal: {
          '0%, 100%': { transform: 'translateX(-25%)' },
          '50%': { transform: 'translateX(0%)' },
        }
      },
      animation: {
        "bounceH": 'bouceHorizontal 1s infinite',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "bumblebee",
      "dark",
    ],
  }
}
