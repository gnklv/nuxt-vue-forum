export default function ({ store }) {
  console.log('[Middleware] Check Auth');
  if (process.client) {
    store.dispatch('initAuth');
  }
}
