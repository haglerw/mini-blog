import resourceRequest from "/utils/api";
import {
  getCachedPosts,
  setCachedPosts,
  deletePost
} from "/utils/postCache";

Page({
  data: {
    posts: [],
  },
  onLoad() {
    const cached = getCachedPosts();
    this.setData({ posts: cached });
  },
  onReady() {
    this.fetchPosts();
  },
  onShow() {
    const updated = getCachedPosts();
    this.setData({ posts: updated });
  },
  onPullDownRefresh() {
    this.fetchPosts(() => {
      my.stopPullDownRefresh();
    });
  },
  fetchPosts(callback) {
    resourceRequest({
      url: 'https://jsonplaceholder.typicode.com/posts',
      success: ({ data: resData }) => {
        const paged = resData.slice(0, 20);
        this.setData({ posts: paged });
        setCachedPosts(paged);
        if (callback) callback();
      },
      fail: () => {
        my.showToast({
          type: 'fail',
          content: 'Failed to fetch posts',
          duration: 2000
        });
        if (callback) callback();
      }
    })
  },
  goToAdd() {
    my.navigateTo({
      url: '/pages/form/form'
    });
  },
  goToEdit(e) {
    const postId = e.target.dataset.id;
    my.navigateTo({
      url: `/pages/form/form?id=${postId}`
    })
  },
  handleDelete(e) {
    const postId = e.target.dataset.id;
    
    my.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to delete this post?',
      success: (res) => {
        if (res.confirm) {
          resourceRequest({
            url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
            method: 'DELETE',
            success: () => {
              my.showToast({
                type: 'success',
                content: 'Post deleted.',
                duration: 2000
              });
              const updated = deletePost(postId);
              this.setData({ posts: updated });
            }
          })
        }
      }
    });
  }
});
