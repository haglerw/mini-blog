import resourceRequest from "/utils/api";

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
      }
    })
  },

  goBack() {
    my.navigateBack();
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
        data: { title, body, userId: this.data.userId },
        success: () => {
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
