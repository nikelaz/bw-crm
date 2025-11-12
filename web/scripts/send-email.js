const state = {
  form: null,
  logoutButton: null,
};

function checkToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/forbidden.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

async function sendEmail(formData) {
  const fromName = formData.get("from-name");
  const fromEmail = formData.get("from-email");
  const toName = formData.get("to-name");
  const toEmail = formData.get("to-email");
  const subject = formData.get("subject");
  const body = formData.get("message");
  
  if (!fromName || !fromEmail || !toName || !toEmail || !subject || !body) {
    alert("Missing required fields.");
    return;
  }

  const emailJson = {
    from_name: fromName,
    from_email: fromEmail,
    to_name: toName,
    to_email: toEmail,
    subject: subject,
    body: body,
    date: (new Date()).toISOString()
  }

  const reqOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(emailJson),
  };

  const req = await fetch("/api/v1/emails", reqOptions);

  if (req.ok) {
    const res = await req.json();
    alert(res.message);
  } else {
    const errorRes = await req.json();
    alert(errorRes.message);
    return null;
  }
}

async function handlerFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  await sendEmail(formData);
}

function attachEventListeners() {
  state.form.addEventListener("submit", handlerFormSubmit);
  state.logoutButton.addEventListener("click", logout);
}

function queryElements() {
  state.form = document.querySelector(".js-form"); 
  state.logoutButton = document.querySelector(".js-logout-button");
}

function main() {
  checkToken();
  queryElements();
  attachEventListeners();
}

window.addEventListener("DOMContentLoaded", main);
