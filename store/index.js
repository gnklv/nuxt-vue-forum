import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    getters: {
      loadedPosts: state => state.loadedPosts
    },
    mutations: {
      setPosts: (state, posts) => {
        state.loadedPosts = posts
      }
    },
    actions: {
      setPosts: ({ commit }, posts) => {
        commit('setPosts', posts)
      }
    }
  })
};

export default createStore;
