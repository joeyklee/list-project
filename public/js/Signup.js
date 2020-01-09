class Signup {
  constructor(){
    this.signupForm = document.querySelector('.signup__form');
    this.signupURL = "https://joeyklee-list-project.glitch.me/api/v1/users/register"

    this.init();
  }

  init(){
    this.signupForm.addEventListener('submit', async e =>{
      e.preventDefault();
      await this.submitSignup();
    });
  }

  /**
  * submit signup
  */
  async submitSignup(){
    try {
      const userData = {
        username: this.signupForm.username.value,
        email: this.signupForm.email.value,
        password: this.signupForm.password.value
      }
      const options = {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      }

      let data = await fetch(this.signupURL, options);
      data = await data.json();
      // after signup up send the user to the home page
      alert('signup successful!')
      window.location.href = '/';
    } catch (error) {
      alert(error);
    }
  }
}