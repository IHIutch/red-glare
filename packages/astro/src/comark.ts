import { parse, type ComarkTree } from "comark";
import highlight from "comark/plugins/highlight";

export type { ComarkTree };

/**
 * Parse markdown content into a Comark AST with configured plugins.
 * The AST is then rendered by @comark/react's ComarkRenderer in Astro routes.
 */
export async function parseContent(
  markdown: string,
): Promise<ComarkTree> {
  return parse(markdown, {
    plugins: [
      highlight({
        themes: {
          light: "github-light" as any,
          dark: "github-dark" as any,
        },
      }),
    ],
  });
}
