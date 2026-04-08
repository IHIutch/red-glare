import type { Plugin } from "vite";
import type { StarsAndStripesConfig } from "../config.js";

const VIRTUAL_MODULES = {
  "virtual:starsandstripes/config": "",
  "virtual:starsandstripes/context": "",
} as const;

type VirtualModuleId = keyof typeof VIRTUAL_MODULES;

function resolvedId(id: string): string {
  return `\0${id}`;
}

export function vitePluginVirtualConfig(
  config: StarsAndStripesConfig,
  astroConfig: { root: URL; trailingSlash: string },
): Plugin {
  const modules: Record<VirtualModuleId, string> = {
    "virtual:starsandstripes/config": `export default ${JSON.stringify(config)};`,
    "virtual:starsandstripes/context": `export default ${JSON.stringify({
      root: astroConfig.root.toString(),
      trailingSlash: astroConfig.trailingSlash ?? "ignore",
    })};`,
  };

  return {
    name: "vite-plugin-starsandstripes-config",
    resolveId(id) {
      if (id in modules) return resolvedId(id);
    },
    load(id) {
      for (const [moduleId, code] of Object.entries(modules)) {
        if (id === resolvedId(moduleId)) return code;
      }
    },
  };
}
