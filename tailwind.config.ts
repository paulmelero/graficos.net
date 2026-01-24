import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const customColors = {
  currentColor: colors.current,
  transparent: colors.transparent,
  black: colors.black,
  white: colors.white,
  fwhite: 'hsl(0, 0%, 98%)',
  'gray-darkest': colors.zinc['800'],
  'gray-darker': colors.zinc['700'],
  'gray-dark': colors.zinc['600'],
  gray: colors.zinc['500'],
  'gray-light': colors.zinc['400'],
  'gray-lightest': colors.zinc['100'],
}

const themeColors = {
  primary: 'oklch(0.71 0.2 53.96)', // outside of the sRGB gamut!!
  primaryDark: colors.zinc['900'],
  secondary: colors.amber['700'],
  secondaryDark: 'oklch(0.68 0.22 42.54)',
  accent: '#c31b54',
  accentDark: colors.orange['300'],
  action: colors.purple['700'],
  actionDark: colors.amber['600'],
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
        ibm: ['IBM Plex Mono', 'monospace'],
        'ibm-sans': ['IBM Plex Sans', 'sans-serif'],
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
      animation: {
        blink: 'blink 1s step-start infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
}
