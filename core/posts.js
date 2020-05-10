import md from 'md'

const defaultMDOptions = {
  headerIds: true,
}

export const POSTS_PER_PAGE = 5

export const getURIFromFileName = (fileName, parentCategory = 'blog') => {
  return `${parentCategory ? '/' + parentCategory : ''}/${fileName.replace('.json', '').replace('./', '')}`
}

const orderDatesComparator = (objectA, objectB) => {
  return new Date(objectB.date) - new Date(objectA.date)
}

export const filterByPage = (posts, pageNumber = 1) => {
  return posts.slice((pageNumber - 1) * POSTS_PER_PAGE, POSTS_PER_PAGE + 1)
}

export const webpackGetPosts = ({ callback = null } = {}) => {
  // Using webpacks context to gather all files from a folder
  // https://webpack.js.org/guides/dependency-management/#require-context
  const context = require.context('~/content/blog/posts/', false, /\.json$/)
  let posts = context.keys().map(key => ({
    ...context(key),
    _path: getURIFromFileName(key),
  }))

  const total = posts.length

  // always sort, because we depend on pagination now
  posts = posts.sort(orderDatesComparator)

  if (callback) {
    posts = callback(posts)
  }

  return { posts, total }
}

export const mdToHTML = (string, options = {}) => {
  const renderer = new md.Renderer()
  renderer.codespan = text => `<code class="language-markup">${text}</code>`

  return md(string, {
    renderer,
    ...defaultMDOptions,
    ...options,
  })
}

export const mdToText = (string, options = {}) => {
  const renderer = new md.Renderer()
  renderer.link = (_href, _title, text) => text + ''
  renderer.paragraph = text => text + ' '
  renderer.heading = renderer.paragraph
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

export const getTagsFromPosts = posts => {
  return [...posts]
    .map(post => post.tags)
    .reduce((acc, arr) => [...acc, ...arr], [])
    .reduce((acc, tag, i, arr) => {
      if (!tag) return acc
      tag.toLowerCase()
      if (acc[tag]) {
        acc[tag]++
      } else {
        acc[tag] = 1
      }
      return acc
    }, {})
}
