class ResetPassword {
  constructor() {
    this.resetForm = document.querySelector('.reset__form');
    this.resetURL = 'http://localhost:3030/api/v1/users/auth/reset_password';

    this.init();
  }

  init() {
    this.resetForm.addEventListener('submit', async e => {
      e.preventDefault();
      await this.submitReset();
    });
  }

  /**
   * submit signup
   */
  async submitReset() {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const reset_token = queryParams.get('token');
      const userData = {
        email: this.resetForm.email.value,
        newPassword: this.resetForm.newpassword.value,
        verifyPassword: this.resetForm.verifypassword.value,
        token: reset_token
      };
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      };

      let data = await fetch(this.resetURL, options);
      data = await data.json();
      // after signup up send the user to the home page
      alert(data.message);
      window.location.href = '/';
    } catch (error) {
      alert(error);
    }
  }
}