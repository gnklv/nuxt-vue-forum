import Vuex from 'vuex';
import Cookie from 'js-cookie';

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
            Cookie.set('jwt', result.idToken);

            localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(result.expiresIn) * 1000);
            Cookie.set('expirationDate', new Date().getTime() + Number.parseInt(result.expiresIn) * 1000);
            return this.$axios.post('http://localhost:3000/api/track-data', { data: 'Authenticated' });
          })
          .catch(e => {
            console.log(e);
          });
      },
      initAuth({ commit, dispatch }, req) {
        let token;
        let expirationDate;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }

          const jwtCookie = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='));

          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split('=')[1];
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1];
        } else {
          token = localStorage.getItem('token');
          expirationDate = localStorage.getItem('tokenExpiration');
        }
        if (new Date().getTime() > +expirationDate || !token) {
          console.log('No token or invalid token');
          dispatch('logout');
          return;
        }
        commit('setToken', token);
      },
      logout({ commit }) {
        commit('clearToken');
        Cookie.remove('jwt');
        Cookie.remove('expirationDate');

        if (process.client) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
        }
      }
    }
  })
};

export default createStore;
