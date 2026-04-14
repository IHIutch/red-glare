import redGlare from '@red-glare/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [
    redGlare({
      title: 'Agency Documentation',
      description: 'Demo documentation site powered by Red Glare',
      governmentBanner: true,
      rss: true,
      nav: [
        { label: 'Getting Started', href: '/getting-started/' },
        {
          label: 'Reference',
          items: [
            { label: 'Components', href: '/components/' },
            { label: 'Configuration', href: '/configuration/' },
            { label: 'Deployment', href: '/deployment/' },
          ],
        },
        { label: 'About', href: '/about/' },
      ],
      editLink: {
        baseUrl: 'https://github.com/example/docs/edit/main/',
      },
      footer: {
        links: [
          { label: 'Getting Started', href: '/getting-started/' },
          { label: 'Components', href: '/components/' },
          { label: 'About', href: '/about/' },
          { label: 'Contact', href: '/contact/' },
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
