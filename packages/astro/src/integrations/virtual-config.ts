import type { Plugin } from 'vite'

import type { RedGlareConfig } from '../config'

type VirtualModuleId = 'virtual:red-glare/config' | 'virtual:red-glare/context'

function resolvedId(id: string): string {
  return `\0${id}`
}

interface AstroConfigSubset {
  root: URL
  trailingSlash: string
  site?: string | URL
  base?: string
}

export function vitePluginVirtualConfig(
  config: RedGlareConfig,
  astroConfig: AstroConfigSubset,
): Plugin {
  // Serialize a pruned slice of the resolved Astro config alongside
  // our own user-facing config. Modules that import
  // `virtual:red-glare/context` — notably the slug route's
  // link validator — receive these fields as JSON constants baked
  // into the prerender chunk, which works regardless of which
  // module scope the importer ends up in (Astro hoists
  // `getStaticPaths` into a separate chunk from the integration
  // module, so runtime mutation of a shared `utils/build-config.ts`
  // from `astro:config:done` doesn't flow across that boundary).
  const siteString = astroConfig.site === undefined
    ? undefined
    : typeof astroConfig.site === 'string'
      ? astroConfig.site
      : astroConfig.site.toString()

  const modules: Record<VirtualModuleId, string> = {
    'virtual:red-glare/config': `export default ${JSON.stringify(config)};`,
    'virtual:red-glare/context': `export default ${JSON.stringify({
      root: astroConfig.root.toString(),
      trailingSlash: astroConfig.trailingSlash ?? 'ignore',
      site: siteString,
      base: astroConfig.base ?? '/',
    })};`,
  }

  return {
    name: 'vite-plugin-red-glare-config',
    resolveId(id) {
      if (id in modules)
        return resolvedId(id)
    },
    load(id) {
      for (const [moduleId, code] of Object.entries(modules)) {
        if (id === resolvedId(moduleId))
          return code
      }
    },
  }
}
