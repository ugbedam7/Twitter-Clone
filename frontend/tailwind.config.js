import daisyui from 'daisyui';
import daisyUIThemes, { black } from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      'light',
      {
        black: {
          ...daisyUIThemes['black'],
          primary: 'rgb(29, 155, 240)',
          secondary: 'rgb(24, 24, 24)'
        }
      }
    ]
  }
};
