//   SOSTHENE 

// DATABASE ARRAYS
let clubs = [];
let events = [];
let students = [];
let admins = [];
let idCounter = 1;


// Sidebar
function appear() {
  let nav = document.getElementById('sidebar');
  nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}

// Navigation display
function showSection(section) {
  document.querySelectorAll("main .card").forEach(div => div.style.display = "none");
  document.getElementById(section).style.display = "block";
  refreshDropdowns();
}

// =====================
//   ADD CLUB
// =====================
function addClub() {
  let name = document.getElementById("clubName").value.trim();
  let slug = document.getElementById("clubSlug").value.trim().toLowerCase();
  let description = document.getElementById("clubDescription").value.trim();

  if (!name || !slug || !description) {
    alert("Please fill ALL fields: name, slug, description.");
    return;
  }

  // Prevent duplicate slug
  if (clubs.some(c => c.slug === slug)) {
    alert("Slug already exists!");
    return;
  }
if( validateClubForm() === false || isValidDescription(description) === false ){
  return;
}
  clubs.push({
    id: idCounter++,
    name,
    slug,
    description
  });

  document.getElementById("clubName").value = "";
  document.getElementById("clubSlug").value = "";
  document.getElementById("clubDescription").value = "";

  renderClubs();
  saveToLocalStorage();
  refreshDropdowns();
  updateStats();
}

// Display club list in admin dashboard
function renderClubs() {
  let table = document.getElementById("clubsTable");
  table.innerHTML = "";

  clubs.forEach(c => {
    table.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.name} <small>(${c.slug})</small></td>
        <td><button onclick="deleteClub(${c.id})">Delete</button></td>
      </tr>
    `;
  });
}

// Delete a club
function deleteClub(id) {
  clubs = clubs.filter(c => c.id !== id);
  saveToLocalStorage();
  renderClubs();
  refreshDropdowns();
  updateStats();
}

// =====================
//     ADD EVENT
// =====================
function addEvent() {
  let name = document.getElementById("eventName").value;
  let imageInput = document.getElementById("eventImage");
  let clubSlug = document.getElementById("eventClub").value;

  if (!name || !clubSlug || !imageInput.files.length) {
    alert("Please fill all event fields.");
    return;
  }

  let reader = new FileReader();
  reader.onload = function () {
    events.push({
      id: idCounter++,
      name,
      clubSlug,
      image: reader.result
    });

    document.getElementById("eventName").value = "";
    document.getElementById("eventImage").value = "";

    saveToLocalStorage();
    renderEvents();
    updateStats();
  };

  reader.readAsDataURL(imageInput.files[0]);
}

function renderEvents() {
  let table = document.getElementById("eventsTable");
  table.innerHTML = "";

  events.forEach(e => {
    let club = clubs.find(c => c.slug === e.clubSlug)?.name || "Unknown";

    table.innerHTML += `
      <tr>
        <td>${e.name}</td>
        <td>${club}</td>
        <td><button onclick="deleteEvent(${e.id})">Delete</button></td>
      </tr>
    `;
  });
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveToLocalStorage();
  renderEvents();
}

// =====================
//  STUDENT MANAGEMENT
// =====================
function addStudent() {
  let name = document.getElementById("studentName").value;
  let emailField=document.getElementById("studentEmail");
  let email = document.getElementById("studentEmail").value;
  let clubSlug = document.getElementById("studentClub").value;

  if (isValidName(name) && isValidEmail(email) && clubSlug) {
    students.push({ id: idCounter++, name, email, clubSlug });

    document.getElementById("studentName").value = "";
    document.getElementById("studentEmail").value = "";

    saveToLocalStorage();
    renderStudents();
    updateStats();
  }
   emailField.classList.add("invalid");
}

function renderStudents() {
  let table = document.getElementById("studentsTable");
  table.innerHTML = "";

  students.forEach(s => {
    let club = clubs.find(c => c.slug === s.clubSlug)?.name || "N/A";

    table.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${club}</td>
        <td><button onclick="deleteStudent(${s.id})">Delete</button></td>
      </tr>
    `;
  });
}

function deleteStudent(id) {
  students = students.filter(s => s.id !== id);
  saveToLocalStorage();
  renderStudents();
  updateStats();
}

// =====================
//      ADMINS
// =====================
function addAdmin() {
  let name = document.getElementById("adminName").value;
  let clubSlug = document.getElementById("adminClub").value;

  if (name && clubSlug) {
    admins.push({ id: idCounter++, name, clubSlug });

    document.getElementById("adminName").value = "";
    saveToLocalStorage();
    renderAdmins();
    updateStats();
  }
}

function renderAdmins() {
  let table = document.getElementById("adminsTable");
  table.innerHTML = "";

  admins.forEach(a => {
    let club = clubs.find(c => c.slug === a.clubSlug)?.name || "N/A";

    table.innerHTML += `
      <tr>
        <td>${a.id}</td>
        <td>${a.name}</td>
        <td>${club}</td>
        <td><button onclick="deleteAdmin(${a.id})">Delete</button></td>
      </tr>
    `;
  });
}

function deleteAdmin(id) {
  admins = admins.filter(a => a.id !== id);
  saveToLocalStorage();
  renderAdmins();
  updateStats();
}

// =====================
//   UPDATE DROPDOWNS
// =====================
function refreshDropdowns() {
  ["eventClub", "studentClub", "adminClub"].forEach(selectId => {
    let select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = "";
      clubs.forEach(c => {
        select.innerHTML += `<option value="${c.slug}">${c.name}</option>`;
      });
    }
  });
}

// =====================
// LOCAL STORAGE SYSTEM
// =====================
function saveToLocalStorage() {
  localStorage.setItem('clubs', JSON.stringify(clubs));
  localStorage.setItem('events', JSON.stringify(events));
  localStorage.setItem('students', JSON.stringify(students));
  localStorage.setItem('admins', JSON.stringify(admins));
  localStorage.setItem('idCounter', idCounter.toString());

  // ALSO CREATE clubsMap FOR HOMEPAGE
  let clubMap = {};
  clubs.forEach(c => clubMap[c.slug] = c.name);

  localStorage.setItem('clubsMap', JSON.stringify(clubMap));
}

function loadClubs() {
  fetch("get_clubs.php")
    .then(response => response.json())
    .then(data => {
         clubs = data; // tableau JS
    });

}
function loadFromThedatabase() {
 loadClubs();
}
// =====================
// INIT
// =====================

  const menuIcon = document.querySelector('.menu-icon');
  const sidebar= document.getElementById('sidebar');
  menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('active');
    sidebar.classList.toggle('active');
  });
// Barre latérale toggle

document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('.menu-icon');
  const nav = document.querySelector('nav');
  if (menuIcon && nav) {
    menuIcon.addEventListener('click', () => {
      nav.classList.toggle('active-sidebar');
    });
  }
});
   

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}   

function checkEmail() {  
  const emailField = document.getElementById("studentEmail");
  const email = emailField.value;

  emailField.classList.remove("valid", "invalid");

  if (isValidEmail(email)) {
    emailField.classList.add("valid");
  } else {
    emailField.classList.add("invalid");
  }
}
function isValidDescription(desc) {
  const trimmed = desc.trim();
  const descriptionField = document.getElementById("clubDescription");

  // reset classes
  descriptionField.classList.remove("valid", "invalid");

  if (trimmed.length < 10 || trimmed.length > 500) {
    descriptionField.classList.add("invalid");
    return false;
  }

  const forbiddenPattern = /<[^>]*>/;
  if (forbiddenPattern.test(trimmed)) {
    descriptionField.classList.add("invalid");
    return false;
  }

  descriptionField.classList.add("valid");
  return true;
}
function isValidName(name) {
  // Supprime les espaces au début/fin
   name = name.trim();

  // Expression régulière pour valider le nom
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ -][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

  return regex.test(name) && name.length >= 2;
}


document.addEventListener('DOMContentLoaded', () => {
  loadFromThedatabase();
  renderClubs();
  renderEvents();
  renderStudents();
  renderAdmins();
  refreshDropdowns();
  updateStats();
});
function updateStats() {
  document.getElementById("statClubs").innerText = clubs.length;
  document.getElementById("statEvents").innerText = events.length;
  document.getElementById("statStudents").innerText = students.length;
  document.getElementById("statAdmins").innerText = admins.length;

  drawPieChart();
}

function drawPieChart() {
  const canvas = document.getElementById("pieChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const data = [
    clubs.length,
    events.length,
    students.length,
    admins.length
  ];

  const labels = ["Clubs", "Events", "Students", "Admins"];

  const colors = ["#4CAF50", "#2196F3", "#FFC107", "#E91E63"];

  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const total = data.reduce((a, b) => a + b, 0);
  let startAngle = 0;

  data.forEach((value, i) => {
    if (value === 0) return;

    const sliceAngle = (value / total) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(175, 175);
    ctx.arc(175, 175, 150, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();

    startAngle += sliceAngle;
  });
}

function validateClubForm() {
    let clubName = document.getElementById("clubName").value.trim();
    let description = document.getElementById("description").value.trim();
    let errors = [];

    // clubName checks
    if (clubName.length < 3) {
        errors.push("Le nom du club doit faire au moins 3 caractères.");
    }
    if (clubName.length > 100) {
        errors.push("Le nom du club ne doit pas dépasser 100 caractères.");
    }
    if (!/^[\p{L}0-9\s\-]+$/u.test(clubName)) {
        errors.push("Nom du club : caractères invalides.");
    }

    // description checks
    if (description.length < 10) {
        errors.push("La description doit faire au moins 10 caractères.");
    }
    if (description.length > 500) {
        errors.push("La description ne doit pas dépasser 500 caractères.");
    }

    // Show errors
    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false; // Empêche l’envoi du formulaire
    }

    return true; // OK pour envoyer
}
