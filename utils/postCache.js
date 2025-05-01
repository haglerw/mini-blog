const CACHE_KEY = 'posts';

export function getCachedPosts() {
  const result = my.getStorageSync({ key: CACHE_KEY });
  return result.data || [];
}

export function setCachedPosts(posts) {
  my.setStorageSync({ key: CACHE_KEY, data: posts });
}

export function addPost(post) {
  const posts = getCachedPosts();
  const updated = [post, ...posts];
  setCachedPosts(updated);
  return updated;
}

export function updatePost(id, updatedPost) {
  const posts = getCachedPosts();
  const updated = posts.map(post => (post.id == id ? { ...post, ...updatedPost } : post));
  setCachedPosts(updated);
  return updated;
}

export function deletePost(id) {
  const posts = getCachedPosts();
  const updated = posts.filter(post => post.id != id);
  setCachedPosts(updated);
  return updated;
}
