/**
 * Shared shape for pre-resolved Iconify data. Lives in its own file so
 * client-rendered components can type-reference it without transitively
 * pulling in the `@iconify-json/*` JSON imports that live in `icons.ts`.
 */
export interface IconData {
  body: string
  width: number
  height: number
}
