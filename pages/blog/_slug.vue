<template>
  <article>
    <h1>{{ post.title }}</h1>
    <p>{{ post.date }}</p>
    <img class="img-post" :src="post.thumbnail">
    <p>{{ post.body }}</p>
  </article>
</template>

<script>
export default {
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
  head() {
    return {
            title: `${ (this.post && this.post.title) || 'Post' }`,
            meta: [
                {
                    name: 'description',
                    content: `${ (this.description && this.post.description) || '' }`,
                    hid: 'description'
                }
            ]
        };
  },
  async asyncData({ params }) {
    const post = await import('~/content/blog/posts/' + params.slug + '.json');
    console.log(post);
    return { post };
  }
};
</script>