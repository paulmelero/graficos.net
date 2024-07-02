import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const customColors = {
  currentColor: colors.current,
  transparent: colors.transparent,
  black: colors.black,
  white: colors.white,
  fwhite: 'hsl(0, 0%, 98%)',
  'gray-darkest': colors.gray['800'],
  'gray-darker': colors.gray['700'],
  'gray-dark': colors.gray['600'],
  gray: colors.gray['500'],
  'gray-light': colors.gray['400'],
  'gray-lightest': colors.gray['100'],
  'teal-dark': colors.teal['600'],
  teal: colors.teal['500'],
  'teal-darker': colors.teal['700'],
  'teal-light': colors.teal['400'],
  'purple-darker': colors.purple['700'],
}

const themeColors = {
  primary: colors.teal['500'],
  primaryDark: colors.gray['900'],
  secondary: colors.teal['700'],
  secondaryDark: colors.teal['800'],
  accent: '#c31b54',
  accentDark: colors.pink['700'],
  action: colors.purple['700'],
  actionDark: colors.teal['500'],
}

type ThemeContext = { theme: <T = Config['theme']>(path: string, defaultValue?: T) => T }

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    colors: customColors,
    extend: {
      colors: themeColors,
      container: {
        center: true,
      },
      screens: {
        xs: '320px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
      },
      fontFamily: {
        sans: [
          'system-ui',
          'BlinkMacSystemFont',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        serif: [
          'Constantia',
          'Lucida Bright',
          'Lucidabright',
          'Lucida Serif',
          'Lucida',
          'DejaVu Serif',
          'Bitstream Vera Serif',
          'Liberation Serif',
          'Georgia',
          'serif',
        ],
        mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: '.75rem', // 12px
        sm: '.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem', // 48px
      },
      minHeight: {
        50: '50vh',
      },
      fill: ({ theme }: ThemeContext) => ({
        current: 'currentColor',
        white: theme('colors.white'),
        primary: theme('colors.primary'),
      }),
      borderColor: ({ theme }: ThemeContext) => ({
        default: theme("colors['gray-light']", 'currentColor'),
      }),
      zIndex: {
        '1': '1',
      },
    },
  },
}
