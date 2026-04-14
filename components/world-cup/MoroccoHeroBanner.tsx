/**
 * Backward-compat shim.
 *
 * The canonical MoroccoHeroBanner now lives at
 * `@/components/primitives/MoroccoHeroBanner`.
 *
 * This file is preserved so the existing `/wc-2026` call site:
 *   import { MoroccoHeroBanner } from '@/components/world-cup/MoroccoHeroBanner'
 * continues to compile unchanged. The primitive defaults to `variant="wc"`
 * so behaviour is identical to the pre-lift version without any prop update.
 *
 * TODO: once /wc-2026/page.tsx is next touched (any reason), update its
 * import to `@/components/primitives/MoroccoHeroBanner` and delete this
 * shim. Keeping it alive avoids forcing unrelated changes in this PR.
 */

export {
  MoroccoHeroBanner,
  type MoroccoHeroBannerProps,
  type MoroccoMatch,
  type MoroccoHeroVariant,
  type MoroccoHeroCTA,
} from '@/components/primitives/MoroccoHeroBanner'
