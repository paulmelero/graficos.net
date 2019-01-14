import { sync } from 'glob-all';
import { getURIFromFileName, mdToHTML } from './posts';

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
  const posts = sync([cwd + '/*.json'])
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
      content: mdToHTML(post.body)
    })
  })

  feed.addContributor({
    name: authorName,
    email: authorMail,
    link: authorLink
  })
}

export default createRSSFeed
