function checkToken() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = '/clients.html';
  }
}

function main() {
  const loginForm = document.querySelector('.js-login-form');
  const loginProgress = document.querySelector('.js-login-progress');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginProgress.hidden = false;

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const req = await fetch('/api/v1/users/login', reqOptions);

    if (req.ok) {
      const res = await req.json();
      localStorage.setItem('token', res.token);
      window.location.href = '/clients.html';
    } else {
      const errorRes = await req.json();
      alert(errorRes.message);
    }

    loginProgress.hidden = true;
  });
}

checkToken();
window.addEventListener('DOMContentLoaded', main);
