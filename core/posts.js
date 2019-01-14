import md from 'md'

const defaultMDOptions = {
  headerIds: true,
}

export const getURIFromFileName = (fileName, parentCategory = 'blog') => {
  return `${parentCategory ? '/' + parentCategory : ''}/${fileName.replace('.json', '').replace('./', '')}`
}

export const webapackGetPosts = () => {
  // Using webpacks context to gather all files from a folder
  // https://webpack.js.org/guides/dependency-management/#require-context
  const context = require.context('~/content/blog/posts/', false, /\.json$/);
  const posts = context.keys().map(key => ({
    ...context(key),
    _path: getURIFromFileName(key)
  }));

  return posts
}

export const mdToHTML = (string, options = {}) => {

  const renderer = new md.Renderer()
  renderer.codespan = (text) => `<code class="language-markup">${text}</code>`

  return md(string, {
    renderer,
    ...defaultMDOptions,
    ...options,
  })
}

export const mdToText = (string, options = {}) => {
  const renderer = new md.Renderer()
  renderer.link = (_href, _title, text) => text + ' '
  renderer.paragraph = (text) => text + ' '
  renderer.blockquote = renderer.paragraph
  renderer.br = renderer.paragraph
  renderer.codespan = renderer.paragraph
  renderer.code = (_code, _lang, _escaped) => ' '
  renderer.image = (_href, _title, text) => text + ' '
  renderer.list = (body, _ordered, _tasklist) => body + ' '
  renderer.listitem = (text, _checked) => text + ' '
  renderer.html = () => ' [...] '
  renderer.hr = () => ''

  return md(string, {
    renderer,
    ...options,
  })
}
