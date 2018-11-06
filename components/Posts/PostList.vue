<template>
  <section class="post-list">
    <PostPreview
      v-for="n in 4"
      :key="n"
      :id="`${n}`"
      thumbnail="https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg"
      title="Hello there!"
      previewText="This is my first post!"
    />
  </section>
</template>

<script>
import PostPreview from '@/components/Posts/PostPreview';

export default {
  name: 'PostList',
  components: {
    PostPreview
  }
}
</script>

<style scoped>
.post-list {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
