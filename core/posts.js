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
