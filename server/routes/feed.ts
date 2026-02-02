import { Feed } from 'feed'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const appUrl = config.public.APP_URL
  const appName = config.public.APP_NAME

  const feed = new Feed({
    title: appName,
    description: `Latest articles from ${appName}`,
    id: appUrl,
    link: appUrl,
    language: 'en',
    favicon: `${appUrl}/favicon.ico`,
    updated: new Date(),
    generator: appName,
    image: `${appUrl}/cover.png`,
    feedLinks: {
      atom: `${appUrl}/feed`,
    },
    author: {
      name: 'Paul Melero',
    },
  })

  const articles = await queryCollection(event, 'blog').all()

  articles.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())

  articles.forEach((article) => {
    const url = `${appUrl}/blog/${article.path}`

    feed.addItem({
      title: article.title,
      id: url,
      link: url,
      description: article.description,
      image: article.thumbnail ? `${appUrl}${article.thumbnail}` : undefined,
      author: [
        {
          name: 'Paul Melero',
        },
      ],
      date: new Date(article?.date || ''),
    })
  })

  event.res.setHeader('Content-Type', 'application/atom+xml')
  return feed.atom1()
})
