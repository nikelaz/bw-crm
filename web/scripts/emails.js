let cachedEmails;
let filteredEmails;
let emails;
let currentPage = 1;
let totalPages = 1;
const PER_PAGE = 20;

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

async function fetchEmails() {
  const reqOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const req = await fetch("/api/v1/emails", reqOptions);

  if (req.ok) {
    const res = await req.json();
    console.log('res', res);
    return res.emails;
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

function renderPagination() {
  const paginationWrapper = document.querySelector(".js-pagination");
  if (!paginationWrapper) return;

  paginationWrapper.innerHTML = "";

  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.setAttribute("type", "button");
    prevBtn.innerHTML = "Previous";
    prevBtn.addEventListener("click", () => loadPage(currentPage - 1));
    paginationWrapper.appendChild(prevBtn);
  }

  for (let i = 0; i < totalPages; i++) {
    const paginationBtn = document.createElement("button");
    paginationBtn.setAttribute("type", "button");
    paginationBtn.innerHTML = i + 1;
    if (i === currentPage - 1) {
      paginationBtn.disabled = true;
    }
    else {
      paginationBtn.addEventListener("click", () => loadPage(i + 1));
    }
    paginationWrapper.appendChild(paginationBtn);
  }

  if (currentPage !== totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.setAttribute("type", "button");
    nextBtn.innerHTML = "Next";
    nextBtn.addEventListener("click", () => loadPage(currentPage + 1));
    paginationWrapper.appendChild(nextBtn);
  }
}

function render() {
  const emailsTable = document.querySelector('.js-emails-table');
  const emailsTableBody = emailsTable.querySelector('.js-emails-table-tbody');

  emailsTableBody.innerHTML = "";

  emails.forEach((email) => {
    const tr = document.createElement('tr');
    tr.classList.add("-cursor-pointer");
    tr.dataset.href = `/email-details.html?id=${email.id}`;

    const tdFrom = document.createElement('td');
    tdFrom.textContent = `${email.from_name} <${email.from_email}>`;
    tr.appendChild(tdFrom);

    const tdTo = document.createElement('td');
    tdTo.textContent = `${email.to_name} <${email.to_email}>`;
    tr.appendChild(tdTo);

    tr.addEventListener("click", tableRowClick);
    
    emailsTableBody.appendChild(tr);
  });

  renderPagination();

  emailsTable.hidden = false;  
}

function filter(term) {
  filteredEmails = cachedEmails.filter(email => {
    if (JSON.stringify(email)
      .toLowerCase()
      .trim()
      .includes(term.toLowerCase().trim())
    ) {
      return true;
    }
    return false;
  }); 

  initPagination();
}

function initFilters() {
  cachedEmails = emails;
  filteredEmails = cachedEmails;
  const filterEl = document.querySelector(".js-filter");
  if (!filterEl) {
    return;
  }
  filterEl.addEventListener("change", (e) => filter(e.target.value));
}

function initPagination() {
  totalPages = Math.ceil(filteredEmails.length / 20);
  loadPage(1);
}

function loadPage(n) {
  const start = (n - 1) * 20;
  emails = filteredEmails.slice(start, start + 20);
  currentPage = n;
  render();
}

async function main() {
  const logoutButton = document.querySelector('.js-logout-button');
  logoutButton.addEventListener('click', logout);
  
  const emailsTableLoading = document.querySelector('.js-emails-table-loading');

  emailsTableLoading.hidden = false;

  emails = await fetchEmails();
  emails.sort((x, y) => y.id - x.id);

  if (emails === null) return;
  
  initFilters();
  initPagination();

  render();

  emailsTableLoading.hidden = true;
}

checkToken();
window.addEventListener('DOMContentLoaded', main);
