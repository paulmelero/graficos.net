<template>
  <article>
    <header
      class="py-16 bg-image bg-center bg-cover min-h-50 flex-col flex content-center"
      :style="`background-image: url( ${ post.thumbnail } )`"
    >
      <div class="max-w-3/4 sm:max-w-1/2 my-auto mx-auto">
        <h1 class="mb-8 text-white">{{ post.title }}</h1>
        <p class="text-white">
          <the-time :date="post.date" class="block sm:inline-block"></the-time>
          <span class="hidden sm:inline-block"></span>
          <span class="block sm:inline-block">{{ cupsWhileReading }}️ {{ minutesToRead }} mins read</span>
        </p>
      </div>
    </header>
    <div v-html="parsedBody" class="max-w-3/4 sm:max-w-1/2 mx-auto py-20" ></div>
  </article>
</template>

<script>
import md from 'md';
import Prism from 'prismjs';

const TheTime = () => import('@/components/main-presentation/base-texts/the-time')

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
      },
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
      return (this.post.description + '').slice(0, 300)
    },
    minutesToRead() {
      return Math.floor(this.post.body.split(' ').length  * .99 / 150);
    },
    cupsWhileReading() {
      return this.minutesToRead && new Array(Math.floor(this.minutesToRead / 3)).fill('☕️').join('');
    },
  },
  mounted() {
    Prism.highlightAll(false, () => {
      // console.log('edited')
    })
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
