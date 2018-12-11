const tailwindJS = require('./tailwind.config')

module.exports = {
  // order of requires is important!
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env')({
      stage: 0
    }),
    require('postcss-url'),
    require('tailwindcss')(tailwindJS),
    require('autoprefixer')({
      cascade: false,
      grid: true
    }),
    require('cssnano')({
      preset: 'default',
      discardComments: { removeAll: true },
      zindex: false
    }),
  ],
}
