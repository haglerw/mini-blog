import resourceRequest from "/utils/api";

Page({
  data: {
    posts: [],
  },
  onLoad(query) {
    this.fetchPosts();
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  fetchPosts() {
    resourceRequest({
      url: 'https://jsonplaceholder.typicode.com/posts',
      success: ({ data: resData }) => {
        this.setData({ posts: resData.slice(0, 20) })
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
              this.fetchPosts(); // Needs improvement - use caching
            }
          })
        }
      }
    });
  }
});
