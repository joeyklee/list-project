class Posts {
  constructor(){
    // posts data
    this.posts = [];
    // posts base api url
    this.postsURL = "http://localhost:3030/api/v1/posts";
    // query selectors
    this.postsList = document.querySelector('.posts__view__posts');
    this.postEditForm = document.querySelector('.post__form--edit');
    this.postNewForm = document.querySelector('.post__form--new');

    // initialize the event listeners
    this.init();
  }
  
  /**
   * initialzie with event listeners
   */
  init(){
    this.initEventListeners();
    // update the view on initialization
    this.updateView();
  }

  /**
   * initializeEventListeners
   */
  initEventListeners(){
    // handling submitting data from the edit form
    this.postEditForm.addEventListener('submit', async e => {
      try {
        e.preventDefault();

        const editData = {
          title: this.postEditForm.title.value,
          link: this.postEditForm.link.value,
          description: this.postEditForm.description.value,
          id: this.postEditForm.id.value,
        }
        await this.handleEditPost(editData);  
        await this.updateView();
      } catch (error) {
        alert(error);
      }
    });

    // handle submitting data from the new form
    this.postNewForm.addEventListener('submit', async e => {
      try {
        e.preventDefault();

        const newData = {
          title: this.postNewForm.title.value,
          link: this.postNewForm.link.value,
          description: this.postNewForm.description.value,
        }
        await this.handleNewPost(newData);  
        await this.updateView();
      } catch (error) {
        alert(error);
      }
    });
  }

  /**
   * update the view by requesting all the posts 
   * and creating the post list again
   */
  async updateView(){
    await this.getPosts();
    this.createPostList();
  }

  /**
   * GET posts using fetch
   */
  async getPosts(){
    try{
      let data = await fetch(this.postsURL);
      data = await data.json();
      this.posts = data.reverse();
      return data;
    }catch(err){
      throw new Error(err);
    }
  }

  /**
   * Handle deleting the psot based on the id
   * @param {*} id 
   */
  async handleDeletePost(id){
    try {
      const options = {
        method: 'DELETE',
        credentials: "same-origin",
      }
      const deleteUrl = `${this.postsURL}/${id}`
      let data = await fetch(deleteUrl, options)
      data = await data.json();
      await this.updateView();
      alert(data.message);
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }

  /**
   * Toggle edit post
   */
  setEditPost(id){
    const postEditing = this.posts.find(item => item._id === id)
    this.postEditForm.title.value = postEditing.title;
    this.postEditForm.description.value = postEditing.description;
    this.postEditForm.id.value = postEditing._id;
    this.postEditForm.link.value = postEditing.link;
  }

  /**
   * handling submitting the post data edits
   */
  async handleEditPost(formData){
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify(formData)
      }
      const editUrl = `${this.postsURL}/${formData.id}`
      let data = await fetch(editUrl, options)
      data = await data.json();

      alert('post successfully updated');
    } catch (err) {
      alert(err);
      throw new Error(err);
    }
  }

  /**
   * handle a new post submission
   * @param {*} formData 
   */
  async handleNewPost(formData){
    try {
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(formData)
      }
      let data = await fetch(this.postsURL, options)
      data = await data.json();
      console.log(data);
    } catch (err) {
      alert(err);
      throw new Error(err);
    }
  }

  /**
   * Create one post item
   * @param {*} post 
   */
  createPostItem(post){
    const output = document.createElement('li');
    output.classList.add('section__view__post');
    output.innerHTML = `
      <div class="section__view__post__functions">
        <button class="section__view__post__button section__view__post__button--edit" data-id="${post._id}">edit</button>
        <button class="section__view__post__button section__view__post__button--delete" data-id="${post._id}">delete</button>
      </div>
      <h4 class="section__view__post__title">
        <a href="${post.link}" target="_blank" rel="noreferrer" 
          class="section__view__post__link section__view__post__link--large">
          ${post.title}
        </a>
      </h4>
      <p class="section__view__post__description">
        ${post.description}
      </p>
      <ul class="section__view__post__meta">
        <li class="section__view__post__meta__section section__view__post__meta__username">Submitted by: ${post.createdBy_username}</li>
        <li class="section__view__post__meta__section section__view__post__meta__link">
          <a href="${post.link}" class="section__view__post__link--small">${post.link}</a>
        </li>
      </ul>
    `;

    // listen for delete events
    const deleteButton = output.querySelector('.section__view__post__button--delete');
    deleteButton.addEventListener('click', async e =>{
      await this.handleDeletePost(e.target.dataset.id)
    });
    // listen for toggle events
    const editButton = output.querySelector('.section__view__post__button--edit');
    editButton.addEventListener('click', async e =>{
      this.setEditPost(e.target.dataset.id)
    });
    
    return output;
  }

  /**
   * Create an array of post items
   * @param {*} posts 
   */
  createPostList(){
    const posts = this.posts.map(item => this.createPostItem(item));
    // remove all the posts
    this.postsList.innerHTML = "";
    // append the posts to the postList
    posts.forEach(item => {
      this.postsList.appendChild(item);
    });
  }

}