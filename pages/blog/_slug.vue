<template>
  <article>
    <header
      class="py-16 bg-image bg-center bg-cover min-h-50 flex-col flex content-center"
      :style="`background-image: url( ${ post.thumbnail } )`"
    >
      <div class="container my-auto">
        <h1 class="mb-8 text-white">{{ post.title }}</h1>
        <the-time class="text-white" :date="post.date"></the-time>
      </div>
    </header>
    <div v-html="parsedBody" class="container py-20" ></div>
  </article>
</template>

<script>
import md from 'md';
import Prism from 'prismjs';

import TheTime from '@/components/main-presentation/base-texts/the-time'

export default {
  layout: 'post',
  head() {
    return {
      title: `${ (this.post && this.post.title) || 'Post' }`,
      meta: [
        {
          name: 'description',
          content: `${ (this.trimmedDescription) || '' }`,
          hid: 'description'
        }
      ]
    };
  },
  data() {
    return {
      post: {
        title: '',
        description: '',
        date: '',
        thumbnail: '',
        body: '',
      }
    }
  },
  async asyncData({ params }) {
    const post = await import('~/content/blog/posts/' + params.slug + '.json');
    // console.log(post);
    return { post };
  },
  computed: {
    parsedBody() {
      return md(this.post.body);
    },
    trimmedDescription() {
      return (this.post.description + '').slice(0, 150)
    }
  },
  components: {
    TheTime
  }
};
</script>

<style scoped>
.bg-image {
  @apply z-1 relative;
  &:after {
    content: '';
    @apply pin absolute bg-black opacity-50;
    z-index: -1;
  }
}
</style>
