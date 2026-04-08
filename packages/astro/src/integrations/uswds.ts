import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";

export function getUswdsViteConfig(
  projectRoot: string,
  userSettingsPath?: string,
) {
  const require = createRequire(import.meta.url);
  // Resolve the main entry point, then navigate up to the package root
  const uswdsMain = require.resolve("@uswds/uswds");
  const uswdsPath = uswdsMain.replace(/\/dist\/.*$/, "").replace(/\/src\/.*$/, "");

  return {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler" as const,
          includePaths: [resolve(uswdsPath, "packages")],
          additionalData: userSettingsPath
            ? `@use "${resolve(projectRoot, userSettingsPath)}" as user-settings;\n`
            : "",
        },
      },
    },
  };
}
