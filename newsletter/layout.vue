<script setup lang="ts">
type Frontmatter = {
  title?: string
  summary?: string
  preheader?: string
  date?: string
}

const props = defineProps<{
  markdown: string
  frontmatter: Frontmatter
}>()

const issueDate = computed(() => {
  if (!props.frontmatter.date) return ''

  const date = new Date(props.frontmatter.date)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
})

// Design-only sample. Real issues live in ../content/newsletter/*.md.
definePreviewProps({
  markdown: `## New in the collections

A few things I added since the last issue:

- [**FlipTheCoin.app**](https://flipthecoin.app) — a 3D coin flip simulator with real physics.
- [**Nuxt Comments**](https://github.com/paulmelero/nuxt-comments) — unstyled comments for Nuxt, backed by D1.

## Worth a look

Some links that did not make the collections.

> A quote to see how blockquotes render.

\`\`\`css
.toc {
  scroll-target-group: auto;
}
\`\`\``,
  frontmatter: {
    title: 'Drop 001',
    summary: 'Baseline updates, a CSS scroll spy, and a few things I liked this month.',
    preheader: 'A preview of GRAFICOZZ.',
    date: '2026-11-30',
  },
})

useHead({
  title: props.frontmatter.title,
})
</script>

<template>
  <Html>
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
      <style>
        @import '@maizzle/tailwindcss';

        @theme {
          --color-paper: #fafafa;
          --color-ink: #13131c;
          --color-muted: #71717a;
          --color-line: #e4e4e7;
          --color-accent: #c31b54;
          --color-gray-dark: #52525b;
          --color-gray-lightest: #e4e4e7;
          --font-body: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
          --font-code: 'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace;
          --font-display: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        }
      </style>
    </Head>
    <Body class="bg-gray-lightest font-body">
      <Font family="Montserrat" :weights="[900]" provider="bunny" />
      <Font family="IBM Plex Mono" :weights="[400, 700]" provider="bunny" />
      <Font family="IBM Plex Sans" :weights="[400, 700]" provider="bunny" />
      <Preheader>{{ frontmatter.preheader }}</Preheader>

      <Tailwind>
        <Container class="max-w-xl py-8">
          <div class="border border-dashed border-line bg-paper p-6">
            <Row class="mb-6">
              <Column class="w-1/2 align-middle">
                <Text class="m-0 font-code text-sm font-bold tracking-wide text-accent"> GRAFICOZZ </Text>
              </Column>
              <Column class="w-1/2 align-middle">
                <Text v-if="issueDate" class="m-0 text-right font-code text-xs text-muted">{{ issueDate }}</Text>
              </Column>
            </Row>

            <Heading level="1" class="m-0 font-display text-3xl font-black leading-tight text-ink">
              {{ frontmatter.title }}
            </Heading>
            <Text v-if="frontmatter.summary" class="mt-3 font-body text-base leading-relaxed text-gray-dark">
              {{ frontmatter.summary }}
            </Text>

            <Hr class="my-8 border-t border-dashed border-line bg-transparent" />

            <Markdown
              :content="markdown"
              wrapper
              class="prose prose-a:text-accent prose-a:underline prose-a:underline-offset-2 prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-dark prose-code:rounded prose-code:bg-gray-lightest prose-code:px-1 prose-code:py-0.5 prose-code:font-code prose-code:text-sm prose-code:text-ink prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-xl prose-headings:font-bold prose-headings:font-code prose-headings:text-ink prose-hr:my-8 prose-hr:border-dashed prose-hr:border-line prose-hr:bg-transparent prose-img:rounded-md prose-p:text-ink prose-pre:rounded-md prose-pre:bg-ink prose-pre:p-4 prose-pre:text-sm prose-pre:text-gray-lightest prose-strong:text-ink text-ink font-body"
            />

            <Hr class="my-8 border-t border-dashed border-line bg-transparent" />

            <Row>
              <Column class="w-16 align-top">
                <Img src="https://graficos.net/images/sticker-email.png" width="64" height="79" alt="" class="block" />
              </Column>
              <Column class="pl-4 align-middle">
                <Text class="m-0 font-code text-base font-bold text-ink">Paul Melero</Text>
                <Text class="m-0 font-code text-xs text-muted">human | engineer</Text>
              </Column>
            </Row>
            <Text class="mt-6 font-body text-sm leading-relaxed text-gray-dark">
              Reply to this email if you want to say hi.
            </Text>
          </div>
        </Container>
      </Tailwind>
    </Body>
  </Html>
</template>
