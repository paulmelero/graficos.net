# Tailwind CSS v4

Tailwind runs through `@tailwindcss/vite` (wired in `nuxt.config.ts`). There is no `tailwind.config.ts` and no `@nuxtjs/tailwindcss`; do not recreate either.

## Files

- `app/assets/css/main.css` — `@import 'tailwindcss'`, `@source`, `@custom-variant dark`, `@theme`, `@utility container`.
- `app/assets/css/_base.css` — `@layer base` (html/body, links, lists, `pre`/`code`, form controls).
- `app/assets/css/_components.css` — `@layer components` (`.card`, `.pill-button`, `.post-container`, `.article-post`, shiki/twoslash).

## Rules

- **Never use `lang="postcss"` on a `<style>` block that contains `@apply`.** The Tailwind Vite plugin skips those blocks and raw `@apply` ships to the browser. Plain `<style scoped>` works.
- SFC style blocks that use `@apply` need a reference to the theme:
  ```vue
  <style scoped>
  @reference '../../assets/css/main.css';

  .thing {
    @apply bg-primary;
  }
  </style>
  ```
  CSS files imported from `main.css` do not need it.
- Keep custom CSS in `@layer base` or `@layer components`. The one exception is `.router-link-exact-active` in `@layer utilities`: it must beat `text-*` utilities, as it did when unlayered in v3.
- Add tokens in `@theme` in `main.css`. `--color-*: initial` and the missing `--text-*` line-heights are deliberate: they reproduce the old config. Do not remove those resets casually.
- In arbitrary properties use `theme(colors.black)` or a literal (`#000`). `theme(colors.black/5)` was silently opaque in v3 and means 5% in v4, so the slash form changes the result.
- Opacity modifiers (`bg-primary/10`, `border-primary/60`) work in v4, including on `oklch()` colors. They were silently dropped by v3.
- `@source not "../../../newsletter"` keeps the separate Maizzle app out of the scan. `content/**/*.md` is not scanned; add `@source "../../../content/**/*.md"` if you start using Tailwind classes in MDC outside fenced code blocks.
- `container` is a custom utility restoring v3 behavior: centered, with breakpoint max-widths.
- Browser baseline: Safari 16.4+, Chrome 111+, Firefox 128+.

## Gotcha

`font-title` renders italic because `nuxt.config.ts` loads only Montserrat 900 **italic**. The computed `font-style` is normal, but the browser uses the only available face. Adding a normal 900 Montserrat face would flip every `font-title` heading upright.
