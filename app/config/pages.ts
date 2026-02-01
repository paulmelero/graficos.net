export const links = Object.freeze([
  {
    href: '/blog',
    name: 'Blog',
    title: 'Blog',
    head: true,
  },
  { href: '/contact', name: 'Contact', title: 'Contact', head: true },
  { href: '/slashes', name: 'Slash Pages', title: 'Slashes', head: false },
  {
    href: '/opensource',
    name: 'Open Source',
    title: 'Open Source Projects',
    head: false,
  },
])

export const linksWithHome = Object.freeze([
  {
    href: '/',
    name: 'Home',
    title: 'Home',
    head: true,
  },
  ...links,
])
