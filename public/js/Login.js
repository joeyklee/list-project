class Login {
  constructor(){
    this.loginForm = document.querySelector('.login__form');
    this.loginURL = "http://localhost:3030/api/v1/users/login"

    this.init();
  }

  init(){
    this.loginForm.addEventListener('submit', async e =>{
      e.preventDefault();
      await this.submitLogin();
    });
  }

  /**
  * submit signup
  */
  async submitLogin(){
    try {
      const userData = {
        email: this.loginForm.email.value,
        password: this.loginForm.password.value
      }
      const options = {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      }

      let data = await fetch(this.loginURL, options);
      data = await data.json();
      // after signup up send the user to the home page
      alert('login successful!')
      window.location.href = '/';
    } catch (error) {
      alert(error);
    }
  }
}