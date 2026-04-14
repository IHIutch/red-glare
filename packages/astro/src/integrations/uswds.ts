import type { Plugin } from 'vite'

import { createReadStream } from 'node:fs'
import { cp, stat } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const MIME_TYPES: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
}

const PARENT_DIR_REGEX = /^(\.\.(\/|\\|$))+/
const USWDS_DIST_REGEX = /\/dist\/.*$/

const require = createRequire(import.meta.url)

function resolveUswdsPaths() {
  const uswdsMain = require.resolve('@uswds/uswds')
  const uswdsRoot = uswdsMain.replace(USWDS_DIST_REGEX, '')
  return {
    packages: join(uswdsRoot, 'packages'),
    img: join(uswdsRoot, 'dist', 'img'),
  }
}

export function getUswdsViteConfig() {
  const { packages, img } = resolveUswdsPaths()

  const assetPlugin: Plugin = {
    name: '@red-glare/uswds-assets',
    configureServer(server) {
      server.middlewares.use('/assets/img', (req, res, next) => {
        const url = (req.url ?? '/').split('?')[0]
        const rel = normalize(decodeURIComponent(url)).replace(PARENT_DIR_REGEX, '')
        const filePath = join(img, rel)
        if (!filePath.startsWith(img)) {
          next()
          return
        }
        stat(filePath).then((s) => {
          if (!s.isFile()) {
            next()
            return
          }
          res.setHeader('Content-Type', MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream')
          res.setHeader('Content-Length', String(s.size))
          createReadStream(filePath).pipe(res)
        }).catch(() => next())
      })
    },
  }

  return {
    plugins: [assetPlugin],
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [packages],
          quietDeps: true,
        },
      },
    },
  }
}

export async function copyUswdsImages(outDir: URL): Promise<void> {
  const { img } = resolveUswdsPaths()
  const dest = join(fileURLToPath(outDir), 'assets', 'img')
  await cp(img, dest, { recursive: true })
}
