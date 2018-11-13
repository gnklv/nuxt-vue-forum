import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    getters: {
      loadedPosts: state => state.loadedPosts,
      isAuthenticated: state => state.token != null
    },
    mutations: {
      setPosts: (state, posts) => {
        state.loadedPosts = posts
      },
      addPost: (state, post) => {
        state.loadedPosts.push(post);
      },
      editPost: (state, editedPost) => {
        const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id);
        state.loadedPosts[postIndex] = editedPost;
      },
      setToken: (state, token) => {
        state.token = token;
      },
      clearToken: (state) => {
        state.token = null;
      }
    },
    actions: {
      nuxtServerInit({ commit }, { app, error }) {
        return app.$axios.$get(`/posts.json`)
          .then(data => {
            const postsArray = [];
            for (const key in data) {
              postsArray.push({ ...data[key], id: key })
            }
            commit('setPosts', postsArray);
          })
          .catch(e => error(e));
      },
      setPosts({ commit }, posts) {
        commit('setPosts', posts);
      },
      addPost({ state, commit }, post) {
        const createdPost = { ...post, updatedDate: new Date() };
        return this.$axios.$post(`/posts.json?auth=${state.token}`, createdPost)
          .then(data => {
            commit('addPost', { ...createdPost, id: data.name });
          })
          .catch(e => console.log(e));
      },
      editPost({ state, commit }, editedPost) {
        return this.$axios.$put(`/posts/${editedPost.id}.json?auth=${state.token}`, editedPost)
          .then(() => {
            commit('editPost', editedPost);
          })
          .catch(e => console.log(e));
      },
      authenticateUser({ commit, dispatch }, { isLogin, email, password }) {
        let authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=';

        if (isLogin) {
          authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=';
        }

        this.$axios
          .$post(
            authUrl + process.env.fbAPIKey,
            { email, password, returnSecureToken: true }
          )
          .then(result => {
            commit('setToken', result.idToken);
            localStorage.setItem('token', result.idToken);
            dispatch('setLogoutTimer', result.expiresIn * 1000);
            localStorage.setItem('tokenExpiration', new Date().getTime() + result.expiresIn * 1000);
          })
          .catch(e => {
            console.log(e);
          });
      },
      setLogoutTimer({ commit }, duration) {
        setTimeout(() => {
          commit('clearToken');
        }, duration)
      },
      initAuth({ commit, dispatch }) {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('tokenExpiration');

        if (new Date().getTime() > +expirationDate || !token) return;
        dispatch('setLogoutTimer', +expirationDate - new Date().getTime());
        commit('setToken', token);
      }
    }
  })
};

export default createStore;
