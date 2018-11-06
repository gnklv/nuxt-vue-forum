<template>
  <div class="admin-page">
    <section class="new-post">
      <AppButton @click="$router.push('/admin/new-post')">Create Post</AppButton>
    </section>
    <section class="existing-post">
      <h1>Existing Post</h1>
      <PostList
        :posts="loadedPosts"
        isAdmin
      />
    </section>
  </div>
</template>

<script>
import AppButton from '@/components/UI/AppButton';
import PostList from '@/components/Posts/PostList';

export default {
  layout: 'admin',
  components: {
    AppButton,
    PostList
  },
  asyncData(context, callback) {
    setTimeout(() => {
      callback(null, {
        loadedPosts: [
          {
            id: '1',
            title: 'First Post',
            previewText: 'This is our first post!',
            thumbnail: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
          },
          {
            id: '2',
            title: 'Second Post',
            previewText: 'This is our second post!',
            thumbnail: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
          }
        ]
      })
    }, 1500);
  }
}
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.new-post {
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

.existing-posts h1 {
  text-align: center;
}
</style>
