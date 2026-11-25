export const links = Object.freeze([
  {
    href: '/blog',
    name: 'Blog',
    title: 'Blog',
    head: true,
  },
  {
    href: '/collections',
    name: 'Collections',
    title: 'Collections',
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

export const footerNavigation = Object.freeze([
  { href: '/', name: 'Home', title: 'Home' },
  { href: '/contact', name: 'Contact', title: 'Contact' },
  { href: '/privacy', name: 'Privacy', title: 'Privacy' },
])

export const footerSharing = Object.freeze([
  { href: '/blog', name: 'Blog', title: 'Blog' },
  { href: '/collections', name: 'Collections', title: 'Collections' },
  { href: '/slashes', name: 'Slash Pages', title: 'Slashes' },
  { href: '/opensource', name: 'Open Source', title: 'Open Source Projects' },
  { href: '/newsletter', name: 'GRAFICOZZ', title: 'GRAFICOZZ' },
])
