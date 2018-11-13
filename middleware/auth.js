export default function ({ store, redirect }) {
  console.log('[Middleware] Just Auth');
  if (!store.getters.isAuthenticated) {
    redirect('/admin/auth');
  }
}
