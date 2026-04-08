import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";

export function getUswdsViteConfig(
  projectRoot: string,
  userSettingsPath?: string,
) {
  const require = createRequire(import.meta.url);
  const uswdsPath = dirname(require.resolve("@uswds/uswds/package.json"));

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
