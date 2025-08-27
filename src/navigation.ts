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
        { text: 'Fractional CTO', href: getPermalink('/services') },
        { text: 'Contact', href: 'mailto:getintouch@craftycto.com', target: '_blank' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
        { text: 'CraftyCTO.com', href: 'https://craftycto.com', target: '_blank' },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/jackivers/' },
  ],
  footNote: `
    Copyright 2019-2025 <a class="text-blue-600 underline dark:text-muted" href="https://craftycto.com"> Crafty CTO</a> · All rights reserved.
  `,
};
