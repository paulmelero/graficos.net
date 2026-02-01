const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addUtilities, theme }) {
  addUtilities({
    '.dashed-box': {
      'border-style': 'dashed',
      'border-width': theme('borderWidth.DEFAULT', '1px'),
      'border-color': 'var(--border-color)',
    },
    '.dark .dashed-box': {
      'border-color': 'var(--border-color-dark)',
    },
  })
})
