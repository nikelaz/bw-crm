function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchClient(id) {
  if (id === null || id === undefined) {
    console.error("The id argument is null or undefined in fetchClient()");
    return null;
  }

  const reqOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const req = await fetch(`/api/v1/clients/${id}`, reqOptions);

  if (req.ok) {
    const res = await req.json();
    if (res.clients && res.clients.length === 1) {
      return res.clients[0];
    }
    else {
      console.error("Unexpected response format received in fetchClient()");
      return null;
    }
  } else {
    const errorRes = await req.json();
    alert(errorRes.message);
    return null;
  }
}

function textsert(sel, content) {
  const el = document.querySelector(sel);
  if (el) el.innerHTML = content || "N/A";
}

function boxcheck(sel, checked) {
  const el = document.querySelector(sel);
  if (el) el.checked = checked;
}

function valuert(sel, val) {
  const el = document.querySelector(sel);
  if (el) el.value = val;
}

function render(client) {
  textsert(".js-id", client.id);
  textsert(".js-email", client.email);
  textsert(".js-first-name", client.first_name);
  textsert(".js-last-name", client.last_name);
  textsert(".js-country", client.country);
  textsert(".js-currency", client.currency);
  textsert(".js-created", client.created);
  textsert(".js-last-activity-date", client.last_activity_date);
  boxcheck(".js-do-not-message", client.do_not_message);
  valuert(".js-notes", client.notes);

  const breadcrumbEnd = document.querySelector(".js-breadcrumb-end");
  if (breadcrumbEnd) {
    breadcrumbEnd.href = `/client-details.html?id=${client.id}`;
    breadcrumbEnd.innerHTML = `${client.first_name} ${client.last_name}`;
  }

  const loader = document.querySelector(".js-loader");
  const content = document.querySelector(".js-content");

  if (loader) loader.hidden = true;
  if (content) content.hidden = false; 
}

async function updateClient(id, payload) {
  if (!id) {
    console.error("The id argument is missing in updateClient()");
    return false;
  }

  const reqOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  };

  const req = await fetch(`/api/v1/clients/${id}`, reqOptions);

  if (req.ok) {
    const res = await req.json();
    alert(res.message || "Client updated successfully.");
    return true;
  } else {
    try {
      const errRes = await req.json();
      alert(errRes.message || "Failed to update client.");
    } catch {
      alert("Failed to update client (invalid response).");
    }
    return false;
  }
}

async function formSubmitHandler(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const id = getId();

  const payload = {
    notes: formData.get("notes") || "",
    do_not_message: formData.get("do-not-message") === "on" ? 1 : 0 // checkbox → boolean
  };

  console.log("Sending update:", payload);

  await updateClient(id, payload);
}

function events() {
  const form = document.querySelector(".js-form");
  if (form) {
    form.addEventListener("submit", formSubmitHandler);
  }
}

async function main() {
  const id = getId();

  if (id === null) {
    console.error("ID query parameter is required in the URL");
    return;
  }

  const client = await fetchClient(id);

  if (client === null) {
    console.error("Could not retrieve a client with this id");
    return;
  }

  render(client);

  events();
}

window.addEventListener('DOMContentLoaded', main);
