import redGlare from '@red-glare/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://red-glare.dev',
  integrations: [
    redGlare({
      title: 'Red Glare',
      description:
        'Astro integration for building USWDS-styled federal documentation sites with Comark.',
      governmentBanner: true,
      pagefind: true,
      rss: true,
      llms: true,
      nav: [
        { label: 'Getting Started', href: '/getting-started/installation/' },
        {
          label: 'Guides',
          items: [
            { label: 'Configuration', href: '/configuration/overview/' },
            { label: 'Authoring content', href: '/authoring/frontmatter/' },
            { label: 'Components', href: '/components/alert/' },
            { label: 'Features', href: '/features/search/' },
            { label: 'Styling', href: '/styling/theming/' },
            { label: 'Deployment', href: '/deployment/cloudflare-workers/' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'API template example', href: '/reference/api-endpoint-example/' },
          ],
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/IHIutch/red-glare/edit/main/docs/',
      },
      footer: {
        links: [
          { label: 'Getting Started', href: '/getting-started/installation/' },
          { label: 'Components', href: '/components/alert/' },
          { label: 'Configuration', href: '/configuration/overview/' },
          { label: 'Deployment', href: '/deployment/cloudflare-workers/' },
        ],
        social: [
          { platform: 'github', href: 'https://github.com/IHIutch/red-glare' },
          { platform: 'rss', href: '/feed.xml' },
        ],
      },
      identifier: {
        agency: 'Red Glare',
        parentAgency: {
          name: 'Open source project',
          href: 'https://github.com/IHIutch/red-glare',
        },
        links: [
          { label: 'Repository', href: 'https://github.com/IHIutch/red-glare' },
          { label: 'Issues', href: 'https://github.com/IHIutch/red-glare/issues' },
          { label: 'Accessibility', href: '/features/accessibility/' },
          { label: 'USA.gov', href: 'https://www.usa.gov/' },
        ],
      },
    }),
  ],
})
