import resourceRequest from "/utils/api";
import {
  getCachedPosts,
  addPost,
  updatePost
} from "/utils/postCache";

Page({
  data: {
    form: {
      title: '',
      body: ''
    },
    errors: {
      title: '',
      body: ''
    },
    isEditing: false,
    id: null,
    userId: null
  },

  onLoad(query) {
    if (query.id) {
      this.setData({
        isEditing: true,
        id: query.id
      });
      this.getPost(query.id)
    }
  },

  handleTitleChange(value) {
    this.setData({
      form: {
        ...this.data.form,
        title: value
      }
    });    
  },

  handleBodyChange(value) {
    this.setData({
      form: {
        ...this.data.form,
        body: value
      }
    })
  },

  getPost(id) {
    const cachedPosts = getCachedPosts();
    const found = cachedPosts.find(post => post.id == id);

    if (found) {
      this.setData({
        form: {
          title: found.title,
          body: found.body
        },
        userId: found.userId
      });
    } else {
      resourceRequest({
        url: `https://jsonplaceholder.typicode.com/posts/${id}`,
        success: (res) => {
          this.setData({
            form: {
              title: res.data.title,
              body: res.data.body
            },
            userId: res.data.userId
          })
        },
        fail: () => {
          my.showToast({
            type: 'fail',
            content: 'Post not found',
            duration: 2000
          });
        }
      })
    }
  },

  handleSubmit(e) {
    const { title, body } = e.detail.value;
    const { isEditing, id } = this.data;
    const randomNumber = Math.floor(Math.random() * 20) + 1;

    let hasError = false;
    const errors = { title: '', body: '' }

    if (!title.trim()) {
      errors.title = 'Title is required';
      hasError = true;
    }

    if (!body.trim()) {
      errors.body = 'Body is required';
      hasError = true;
    }

    this.setData({ errors })

    if (hasError) return;

    if (isEditing) {
      resourceRequest({
        url: `https://jsonplaceholder.typicode.com/posts/${id}`,
        method: 'PUT',
        data: { id, title, body, userId: this.data.userId },
        success: () => {
          updatePost(id, { title, body });
          my.showToast({
            type: 'success',
            content: 'Post updated.',
            duration: 2000
          });
          my.navigateBack();
        }
      });
    } else {
      resourceRequest({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        data: { title, body, userId: randomNumber },
        success: () => {
          const newPost = {
            id: Math.floor(Math.random() * 10000),
            title,
            body,
            userId: randomNumber
          };
          addPost(newPost);

          my.showToast({
            type: 'success',
            content: 'Post created.',
            duration: 2000
          });
          my.navigateBack();
        }
      });
    }
  }
});
