import daisyui from 'daisyui';
import daisyUIThemes, { black } from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{html,jsx}',
    './components/**/*.{html,jsx}',
    './index.html'
  ],
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
