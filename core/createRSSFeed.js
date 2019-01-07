const glob = require('glob-all')
const {
  getURIFromFileName
} = require('./posts.c')

const createRSSFeed = (
  feed,
  feedPath,
  authorName,
  authorMail,
  authorLink,
  siteUrl,
  siteName,
  siteDescription,
  image,
  generator,
) => {

  feed.options = {
    title: siteName,
    link: feedPath,
    description: siteDescription,
    image,
    generator,
  }

  const cwd = 'content/blog/posts'
  const posts = glob
    .sync([cwd + '/*.json'])
    .map(file => ({
      ...require(`../${file}`),
      _path: (
        siteUrl + getURIFromFileName(file, 'blog').replace(cwd + '/', '')
      )
    }))

  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: post.date,
      link: post._path,
      description: post.description,
      content: post.body
    })
  })

  feed.addContributor({
    name: authorName,
    email: authorMail,
    link: authorLink
  })
}

module.exports = createRSSFeed
