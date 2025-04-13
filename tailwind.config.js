/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-blue-600',
    'hover:text-blue-700',
    'bg-blue-600',
    'hover:bg-blue-700',
    'border-blue-600',
    'hover:border-blue-700',
    /^header-/,
    /^animate-/,
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  },
}

