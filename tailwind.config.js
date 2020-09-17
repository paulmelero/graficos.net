const defaultTheme = require('tailwindcss/defaultTheme')

// upgrading docs https://tailwindcss.com/docs/upgrading-to-v1#1-update-any-usage-of-text-bg-border-color-classes
const colors = {
  currentColor: defaultTheme.colors.currentColor,
  transparent: defaultTheme.colors.transparent,
  black: defaultTheme.colors.black,
  white: defaultTheme.colors.white,
  fwhite: 'hsl(0, 0%, 98%)',
  'gray-darkest': defaultTheme.colors.gray['800'],
  'gray-darker': defaultTheme.colors.gray['700'],
  'gray-dark': defaultTheme.colors.gray['600'],
  gray: defaultTheme.colors.gray['500'],
  'gray-light': defaultTheme.colors.gray['400'],
  'gray-lightest': defaultTheme.colors.gray['100'],
  'teal-dark': defaultTheme.colors.teal['600'],
  teal: defaultTheme.colors.teal['500'],
  'teal-darker': defaultTheme.colors.teal['700'],
  'teal-light': defaultTheme.colors.teal['400'],
  'purple-darker': defaultTheme.colors.purple['700'],
}

const themeColors = {
  primary: colors['teal'],
  secondary: colors['teal-darker'],
  accent: '#c31b54',
  action: colors['purple-darker'],
}

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    // See https://github.com/FullHuman/purgecss
    // https://tailwindcss.com/docs/controlling-file-size
    content: ['./components/**/*.vue', './pages/**/*.vue', './layouts/**/*.vue'],
    options: {
      whitelist: ['html', 'body', 'line-numbers', 'code-toolbar', 'nuxt-link-exact-active', 'is-active'],
      whitelistPatterns: [
        // tailwind
        /^max-w/,
        /^sm:/,
        /^md:/,
        /^lg:/,
        /^xl:/,
        // prismjs
        /^(lang)/,
        /^\.language\-/,
        /^token/,
        /^pre/,
        /^code/,
        /^svg/,
        /^img/,
        /^label/,
        /^input/,
        /^textarea/,
        /^button/,
        // carbonads
        /carbonads/,
      ],
    },
  },
  theme: {
    colors,
    extend: {
      colors: themeColors,
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
      fontWeight: {
        'extra-light': 200,
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700,
        black: 900,
      },
      backgroundColor: theme => theme('colors'),
      borderColor: theme => ({
        ...theme('colors'),
        default: theme("colors['gray-light']", 'currentColor'),
      }),
      fill: theme => ({
        ...theme('colors'),
        current: 'currentColor',
      }),
      container: {
        center: true,
      },
      zIndex: {
        '1': 1,
      },
    },
  },
  variants: {},
  plugins: [],
  important: false,
}
