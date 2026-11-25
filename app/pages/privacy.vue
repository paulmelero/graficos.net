<template>
  <article class="post-container">
    <BaseTextsTheTitle class="mb-24">
      <h1 class="text-2xl sm:text-3xl">Privacy</h1>
      <template #subtitle>
        <p>What this site collects and why. Last updated: November 2026.</p>
      </template>
    </BaseTextsTheTitle>

    <div class="article-post font-ibm">
      <h2>GRAFICOZZ</h2>
      <p>
        If you subscribe, I store your email address, your name if you provide one, the time you subscribed, and whether
        you have unsubscribed. I use it only to send GRAFICOZZ. The list lives in Cloudflare D1, and emails are delivered
        through Resend. Both process the data on my behalf. Emails may also request web fonts from Bunny Fonts when your
        email client supports them.
      </p>
      <p>
        You can unsubscribe from any email. You can also ask me to delete your address; I will remove it unless I need
        to keep a record that you opted out.
      </p>

      <h2>Site</h2>
      <p>
        This is a static site hosted on Cloudflare. Cloudflare processes requests and may keep standard server logs. The
        site does not use advertising cookies or third-party analytics. Your theme preference is stored locally in your
        browser. Some images are served from Google Cloud Storage, and post pages load public webmentions from
        webmention.io.
      </p>

      <h2>Contact</h2>
      <p>If you email me, I keep the message and address so I can reply. Write to <BaseTextsEmail />.</p>

      <h2>Your rights</h2>
      <p>
        You can ask for a copy of your data, correct it, delete it, or object to processing. If you are in the EU or UK,
        you also have the right to complain to your data protection authority. In Spain, that is the
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">AEPD</a>.
      </p>
    </div>
  </article>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Privacy',
  description: 'What graficos.net collects, why, and how to exercise your data rights.',
})
</script>
