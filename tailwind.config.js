/** @type {import('tailwindcss').Config} */
// Removed: import type { Config } from "tailwindcss";

// Changed: const config: Config = { to module.exports = {
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(255 102 51)', // --primary-default #ff6633
          '100': 'rgb(255 218 204)', // --primary-100 淡橙色
          '200': 'rgb(255 153 102)', // --primary-200 浅橙色
          '400': 'rgb(204 51 0)',   // --primary-400 深橙色
        },
        secondary: {
          DEFAULT: 'rgb(20 65 245)',  // --secondary-default
          '100': 'rgb(200 220 255)', // --secondary-100
          '200': 'rgb(50 125 255)',  // --secondary-200
          '400': 'rgb(0 60 125)',    // --secondary-400
        },
        tertiary: { // Assuming tertiary uses secondary values as per CSS
          DEFAULT: 'rgb(20 65 245)',
          '100': 'rgb(200 220 255)',
          '200': 'rgb(50 125 255)',
          '400': 'rgb(0 60 125)',
        },
        gray: {
          DEFAULT: 'rgb(16 16 16)',   // --gray-default (#101010)
          '50': 'rgb(248 248 248)',   // --gray-50
          '100': 'rgb(230 230 230)',  // --gray-100
          '200': 'rgb(218 218 218)',  // --gray-200
          '300': 'rgb(157 157 157)',  // --gray-300
          '400': 'rgb(111 111 111)',  // --gray-400
          '500': 'rgb(87 87 87)',     // --gray-500
          '600': 'rgb(67 67 67)',     // --gray-600
          '700': 'rgb(36 36 36)',     // --gray-700
          '800': 'rgb(27 27 27)',     // --gray-800
        },
        error: 'rgb(235 13 13)',     // --error
        success: 'rgb(127 204 91)',  // --success
        warning: 'rgb(255 215 75)',  // --warning
        // white and black are usually defaults, but defining explicitly based on vars
        white: 'rgb(255 255 255)',
        black: 'rgb(0 0 0)',
      },
      fontFamily: {
        // 覆盖Tailwind默认的sans字体
        sans: ['ZexinSansText', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // 自定义字体族
        text: ['ZexinSansText', 'sans-serif'],
        display: ['ZexinSansHeadline', 'sans-serif'], // 使用Headline字体作为display字体
        headline: ['ZexinSansHeadline', 'sans-serif'], // 专门用于标题的字体类
      },
      fontSize: {
        '5xl': ['2.5rem', { lineHeight: '1.1' }],
        'hero': ['5rem', {
          lineHeight: '1.1',
        }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      zIndex: {
        '60': '60',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-in-out forwards',
        'slideUp': 'slideUp 0.6s ease-in-out forwards',
        'zoomIn': 'zoomIn 0.6s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            'h3': {
              fontSize: '24px',
              fontWeight: '400',
            },
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
// Removed: export default config; 