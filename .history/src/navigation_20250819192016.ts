import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Archive',
      href: getPermalink('/archive'),
    },
    {
      text: 'Search',
      href: getPermalink('/search'),
    },
    {
      text: 'Services', 
      href: getPermalink('/services'),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
  ],
  actions: [{ text: 'Subscribe', href: getPermalink('/subscribe'), icon: 'tabler:mail' }],
};

export const footerData = {
  links: [
    {
      title: 'Content',
      links: [
        { text: 'Archive', href: getPermalink('/archive') },
        { text: 'Newsletter', href: getPermalink('/subscribe') },
        { text: 'RSS Feed', href: getAsset('/rss.xml') },
      ],
    },
    {
      title: 'Services',
      links: [
        { text: 'CTO Consulting', href: getPermalink('/services') },
        { text: 'Full Services', href: 'https://craftycto.com/services', target: '_blank' },
        { text: 'Contact', href: 'https://craftycto.com/contact', target: '_blank' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'CraftyCTO.com', href: 'https://craftycto.com', target: '_blank' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/jack4git/cto4ai-blog' },
  ],
  footNote: `
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://craftycto.com"> Jack Ivers</a> · All rights reserved.
  `,
};
