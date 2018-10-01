<template>
  <article>
    <h1>{{ post.title }}</h1>
    <p>{{ post.date }}</p>
    <img class="img-post" :src="post.thumbnail">
    <p v-html="parsedBody"></p>
  </article>
</template>

<script>
import {markdown} from 'markdown';
export default {
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
    console.log(post);
    return { post };
  },
  computed: {
    parsedBody() {
      return markdown.toHTML(this.post.body)
    },
    trimmedDescription() {
      return (this.post.description + '').slice(0, 150)
    }
  },
};
</script>