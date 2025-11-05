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

async function fetchClients() {
  const reqOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const req = await fetch('/api/v1/clients', reqOptions);

  if (req.ok) {
    const res = await req.json();
    console.log('res', res);
    return res.clients;
  } else {
    const errorRes = await req.json();
    alert(errorRes.message);
    return null;
  }
}

function tableRowClick(event) {
  const href = event.currentTarget.dataset.href;
  if (!href) return;
  window.location.href = href;
}

function populateClientsTable(clients) {
  const clientsTable = document.querySelector('.js-clients-table');
  const clientsTableBody = clientsTable.querySelector('.js-clients-table-tbody');
  const totalRecords = document.querySelector('.js-total-records');

  totalRecords.innerHTML = clients.length;

  clients.forEach((client) => {
    const tr = document.createElement('tr');
    tr.classList.add("-cursor-pointer");
    tr.dataset.href = `/client-details.html?id=${client.id}`;

    const tdId = document.createElement('td');
    tdId.textContent = client.id;
    tr.appendChild(tdId);

    const tdEmail = document.createElement('td');
    tdEmail.textContent = client.email;
    tr.appendChild(tdEmail);

    const tdFirstName = document.createElement('td');
    tdFirstName.textContent = client.first_name;
    tr.appendChild(tdFirstName);

    const tdLastName = document.createElement('td');
    tdLastName.textContent = client.last_name;
    tr.appendChild(tdLastName);

    const tdCountry = document.createElement('td');
    tdCountry.textContent = client.country;
    tr.appendChild(tdCountry);

    tr.addEventListener("click", tableRowClick);
    
    clientsTableBody.appendChild(tr);
  });

  clientsTable.hidden = false;
}

async function main() {
  const logoutButton = document.querySelector('.js-logout-button');
  logoutButton.addEventListener('click', logout);
  
  const clientsTableLoading = document.querySelector('.js-clients-table-loading');

  clientsTableLoading.hidden = false;

  const clients = await fetchClients();

  if (clients === null) return;

  populateClientsTable(clients);

  clientsTableLoading.hidden = true;
}

checkToken();
window.addEventListener('DOMContentLoaded', main);
