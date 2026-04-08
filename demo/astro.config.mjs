import { defineConfig } from 'astro/config'
import starsAndStripes from '@starsandstripes/astro'

export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [
    starsAndStripes({
      title: 'Agency Documentation',
      description: 'Demo documentation site powered by Stars and Stripes',
      governmentBanner: true,
      editLink: {
        baseUrl: 'https://github.com/example/docs/edit/main/',
      },
      footer: {
        links: [
          {
            heading: 'Documentation',
            items: [
              { label: 'Getting Started', href: '/getting-started/' },
              { label: 'Components', href: '/components/' },
            ],
          },
        ],
        contact: {
          heading: 'Agency Help Desk',
          phone: '(800) 555-1234',
          email: 'help@agency.gov',
        },
        social: [
          { platform: 'github', href: 'https://github.com/example' },
          { platform: 'rss', href: '/feed.xml' },
        ],
      },
      identifier: {
        agency: 'Example Agency',
        parentAgency: {
          name: 'U.S. Department of Examples',
          href: 'https://example.gov',
        },
        links: [
          { label: 'About', href: '/about' },
          { label: 'Accessibility', href: '/accessibility' },
          { label: 'FOIA Requests', href: '/foia' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'USA.gov', href: 'https://www.usa.gov/' },
        ],
      },
    }),
  ],
})
