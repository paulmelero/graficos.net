const md = require('md')

const getURIFromFileName = (fileName, parentCategory = 'blog') => {
  return `${parentCategory ? '/' + parentCategory : ''}/${fileName.replace('.json', '').replace('./', '')}`
}

const webapackGetPosts = () => {
  // Using webpacks context to gather all files from a folder
  // https://webpack.js.org/guides/dependency-management/#require-context
  const context = require.context('~/content/blog/posts/', false, /\.json$/);
  const posts = context.keys().map(key => ({
    ...context(key),
    _path: getURIFromFileName(key)
  }));

  return posts
}

const renderer = new md.Renderer()
renderer.codespan = (text) => `<code class="language-markup">${text}</code>`

const mdToHTML = (string) => {
  return md(string, { renderer })
}

module.exports = {
  getURIFromFileName,
  webapackGetPosts,
  mdToHTML,
}
