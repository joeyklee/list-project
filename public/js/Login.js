class Login {
  constructor() {
    this.loginForm = document.querySelector('.login__form');
    this.forgotForm = document.querySelector('.forgot__form');
    this.loginURL = 'http://localhost:3030/api/v1/users/login';
    this.forgotURL = 'http://localhost:3030/api/v1/users/auth/forgot_password';

    this.init();
  }

  init() {
    this.loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      await this.submitLogin();
    });

    this.forgotForm.addEventListener('submit', async e => {
      e.preventDefault();
      await this.submitForgotPassword();
    });
  }

  /**
   * submit signup
   */
  async submitLogin() {
    try {
      const userData = {
        email: this.loginForm.email.value,
        password: this.loginForm.password.value
      };
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      };

      let data = await fetch(this.loginURL, options);
      data = await data.json();
      // after signup up send the user to the home page
      alert('login successful!');
      window.location.href = '/';
    } catch (error) {
      alert(error);
    }
  }

  async submitForgotPassword() {
    try {
      const userData = {
        email: this.forgotForm.email.value
      };
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      };

      let data = await fetch(this.forgotURL, options);
      data = await data.json();
      // after signup up send the user to the home page
      alert(
        'An email was sent to your inbox. Please check your inbox and spam folder to reset your password.'
      );
      // window.location.href = '/';
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
}
