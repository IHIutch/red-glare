import { createRequire } from "node:module";

export function getUswdsViteConfig() {
  // Resolve USWDS packages path from wherever pnpm installed it
  const require = createRequire(import.meta.url);
  const uswdsMain = require.resolve("@uswds/uswds");
  const uswdsPackages = uswdsMain.replace(/\/dist\/.*$/, "/packages");

  return {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [uswdsPackages],
          quietDeps: true,
        },
      },
    },
  };
}
