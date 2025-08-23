/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        Jakarta: ['Jakarta', 'sans-serif'],
        JakartaBold: ['Jakarta-Bold', 'sans-serif'],
        JakartaExtraBold: ['Jakarta-ExtraBold', 'sans-serif'],
        JakartaExtraLight: ['Jakarta-ExtraLight', 'sans-serif'],
        JakartaLight: ['Jakarta-Light', 'sans-serif'],
        JakartaMedium: ['Jakarta-Medium', 'sans-serif'],
        JakartaSemiBold: ['Jakarta-SemiBold', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#e9faf0',
          200: '#d3f5e1',
          300: '#bdf0d2',
          400: '#a7ebc3',
          500: '#43d478',
          600: '#36aa60',
          700: '#287f48',
          800: '#1b5530',
          900: '#0d2a18',
        },
        secondary: {
          100: '#fefefe',
          200: '#fdfdfd',
          300: '#fcfcfc',
          400: '#fafafa',
          500: '#f5f5f5',
          600: '#c4c4c4',
          700: '#939393',
          800: '#626262',
          900: '#313131',
        },
        general: {
          100: '#CED1DD',
          200: '#858585',
          300: '#EEEEEE',
          400: '#0CC25F',
          500: '#F6F8FA',
          600: '#E6F3FF',
          700: '#EBEBEB',
          800: '#ADADAD',
        },
        background: '#fafafa',
      },
    },
  },
  plugins: [],
};
