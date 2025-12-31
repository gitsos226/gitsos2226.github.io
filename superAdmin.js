//   SOSTHENE 

// DATABASE ARRAYS
let clubs = [];
let events = [];
let students = [];
let admins = [];

// Removed client-side idCounter; IDs are managed by the database
 document.addEventListener('DOMContentLoaded', () => {
 const clubSlug = document.getElementById('clubSlug');
 const clubDesc = document.getElementById("clubDescription");
  const clubLogo = document.getElementById('clubLogo');
   const clubPhoto = document.getElementById('clubPhoto');
   const studentEmail = document.getElementById('studentEmail');
   const clubName = document.getElementById('clubName');
   const studentFirstName = document.getElementById('student_fname');
   const studentLastName = document.getElementById('student_lname');
   const adminEmail = document.getElementById('adminEmail');
   const adminPassword = document.getElementById('adminPassword');
   const adminRole = document.getElementById('adminRole');


    if (clubName) {
    clubName.addEventListener('input', e => {
      setInputValidity(clubName, isClubNameValid(clubName.value));
      // Update slug suggestion if empty
      if (clubSlug && (!clubSlug.value || clubSlug.value.trim() === '')) {
        try { clubSlug.value = slugify(clubName.value); } catch(e){}
        setInputValidity(clubSlug, isSlugValid(clubSlug.value));
      }
    });
  }

  if (clubSlug) {
    clubSlug.addEventListener('input', e => {
      const v = clubSlug.value;
      setInputValidity(clubSlug, isSlugValid(v));
    });
  }
  if (clubDesc) {
    clubDesc.addEventListener('input', e => {
      const ok = isValidDescription(clubDesc.value);
      setInputValidity(clubDesc, ok);
    });
  }

  if (clubLogo) {
    clubLogo.addEventListener('change', e => {
      const f = clubLogo.files && clubLogo.files[0];
      setInputValidity(clubLogo, isFileValid(f));
    });
  }

  if (clubPhoto) {
    clubPhoto.addEventListener('change', e => {
      const f = clubPhoto.files && clubPhoto.files[0];
      setInputValidity(clubPhoto, isFileValid(f));
    });
  }
 
  if (studentEmail) {
    studentEmail.addEventListener('input', e => {
      setInputValidity(studentEmail, isValidEmail(studentEmail.value));
    });
  }
if( studentFirstName && studentLastName){
  studentFirstName.addEventListener('input', e => {
    setInputValidity(studentFirstName, isValidName(studentFirstName.value));
  });
  studentLastName.addEventListener('input', e => {
    setInputValidity(studentLastName, isValidName(studentLastName.value));
  }
  )}


 if( adminEmail ){
  adminEmail.addEventListener('input', e => {
    setInputValidity(adminEmail, isValidEmail(adminEmail.value));
  });
 }
 if( adminPassword){
  adminPassword.addEventListener('input', e => {
    const passwordValidation = validatePassword(adminPassword.value);
    setInputValidity(adminPassword, passwordValidation.valid);
  });
 }
 if( adminRole ){
  adminRole.addEventListener('input', e => {
    setInputValidity(adminRole, isValidName(adminRole.value));
  });
 }
});

// =====================
//    NAVIGATION
// =====================

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

// (removed localStorage persistence — app now relies on the database)

// JavaScript for club addition via fetch API
// Add club via fetch to insert_club.php
function slugify(text) {
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// IDs are managed by the database; remove client-side idCounter
function validateClubForm() {
    let clubName = document.getElementById("clubName").value.trim();
    let description = document.getElementById("clubDescription").value.trim();
    let errors = [];

    // clubName checks
    if (clubName.length < 3) {
        errors.push("Club name must be at least 3 characters.");
    }
    if (clubName.length > 100) {
        errors.push("Club name must not exceed 100 characters.");
    }
    if (!/^[\p{L}0-9\s\-]+$/u.test(clubName)) {
        errors.push("Club name: invalid characters.");
    }

    // Description checks
    if (description.length < 10) {
        errors.push("Description must be at least 10 characters.");
    }
    if (description.length > 500) {
        errors.push("Description must not exceed 500 characters.");
    }

    // Show errors
    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false; // Prevent form submission
    }

    return true; // OK to submit
}


function addClub() {
  if (!validateClubForm()) return;

  const clubForm = document.getElementById('clubForm');
  let fd;
  if (clubForm) {
    fd = new FormData(clubForm);
    // ensure slug exists
    if (!fd.get('clubSlug') || fd.get('clubSlug').toString().trim() === '') {
      const name = (fd.get('clubName') || '').toString();
      fd.set('clubSlug', slugify(name));
    }
  } else {
    // If the form does not exist, create FormData manually
    // Fallback (shouldn't happen if form exists)
    const name = document.getElementById('clubName').value.trim();
    const description = document.getElementById('clubDescription').value.trim();
    const slugInput = document.getElementById('clubSlug').value.trim();
    const slug = slugInput || slugify(name);
    const logoInput = document.getElementById('clubLogo');
    const photoInput = document.getElementById('clubPhoto');
    fd = new FormData();
    fd.append('clubName', name);
    fd.append('description', description);
    fd.append('clubSlug', slug);
    if (logoInput && logoInput.files.length) fd.append('logo', logoInput.files[0]);
    if (photoInput && photoInput.files.length) fd.append('photo', photoInput.files[0]);
  }

  fetch('insert_club.php', { method: 'POST', body: fd })
    .then(r => {
      if (!r.ok) {
        // non-2xx response: read text for debugging
        return r.text().then(txt => {
          console.error('insert_club non-ok response', r.status, txt);
          alert('Server error: ' + r.status + '\nCheck console for details.');
          return null;
        });
      }
      return r.json().catch(err => {
        console.error('Failed to parse JSON from insert_club:', err);
        return null;
      });
    })
    .then(data => {
      if (!data) {
        console.log('insert_club raw response not JSON or error status');
        // try to reload clubs anyway
        if (typeof loadClubs === 'function') loadClubs();
        return;
      }

      if (data.success) {
        alert('Club added successfully.');
        // clear inputs
        if (clubForm) clubForm.reset();
        if (typeof loadClubs === 'function') loadClubs();
      } else {
        const err = data.error || (data.errors ? data.errors.join('\n') : 'Unknown error');
        alert('Server error: ' + err);
        console.error('insert_club error', data);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Network error while adding club.');
    });
}

function loadClubs() {
  fetch('get_clubs.php')
    .then(r => {
      if (!r.ok) {
        console.error('get_clubs failed', r.status);
        return null;
      }
      return r.json().catch(err => { console.error('get_clubs json parse', err); return null; });
    })
    .then(data => {
      clubs = data || [];
      renderClubs();
      refreshDropdowns();
      updateStats();
    })
    .catch(err => console.error('Failed to load clubs:', err));
}
// =====================
//   ADD CLUB
// =====================


// Display club list in admin dashboard
function renderClubs() {
  let table = document.getElementById("clubsTable");
  table.innerHTML = "";

  clubs.forEach(c => {
    table.innerHTML += `
      <tr>
        <td>${c.club_id}</td>
        <td>${c.name} <small>(${c.slogan || ''})</small></td>
        <td><button onclick="viewMembers(${c.club_id})"> view members</button></td>
        <td><button onclick="deleteClub(${c.club_id})">Delete</button></td>
      </tr>
    `;
  });
}

// Delete a club
function deleteClub(id) {
  fetch('delete_club.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id: id })
  })
  .then(r => {
    if (!r.ok) {
      console.error('delete_club failed', r.status);
      return r.text().then(txt => { console.error('Response:', txt); return null; });
    }
    return r.json().catch(err => { console.error('delete_club json parse', err); return null; });
  })
  .then(data => {
    if (data && data.success) {
      // Reload clubs from server
      loadClubs();
    } else {
      const err = data ? (data.error || 'Unknown error') : 'Invalid response';
      alert('Deletion error: ' + err);
    }
  })
  .catch(err => {
    console.error('Network error deleteClub:', err);
    alert('Network error during deletion.');
  });
}



// =====================
//  STUDENT MANAGEMENT
// =====================
function validateStudentForm(){
    let studentFirstName = document.getElementById("student_fname").value.trim();
    let studentLastName = document.getElementById("student_lname").value.trim();
    let studentEmail = document.getElementById("studentEmail").value.trim();
    let errors = [];

    // Name validation
    if (studentFirstName === '' || studentLastName === '') {
        errors.push("Student name is required.");
    } else if (!isValidName(studentFirstName) || !isValidName(studentLastName)) {
        errors.push("Student name must start with a letter and contain at least 2 characters.");
    }

    // Email validation
    if (studentEmail === '') {
        errors.push("Email is required.");
    } else if (!isValidEmail(studentEmail)) {
        errors.push("Email is not valid.");
    }

    // Club selection
    // Show errors
    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false;
    }

    return true;
}

function addStudent() {
  if (!validateStudentForm()) return;

  let fname = document.getElementById("student_fname").value.trim();
  let lname = document.getElementById("student_lname").value.trim();
  let email = document.getElementById("studentEmail").value.trim();

  const fd = new FormData();
  fd.append('student_fname', fname);
  fd.append('student_lname', lname);
  fd.append('studentEmail', email);

  fetch('insert_student.php', { method: 'POST', body: fd })
    .then(r => {
      if (!r.ok) {
        return r.text().then(txt => {
          console.error('insert_student non-ok response', r.status, txt);
          alert('Server error: ' + r.status + '\nCheck console for details.');
          return null;
        });
      }
      return r.json().catch(err => {
        console.error('Failed to parse JSON from insert_student:', err);
        return null;
      });
    })
    .then(data => {
      if (!data) {
        console.log('insert_student raw response not JSON or error status');
        if (typeof loadStudents === 'function') loadStudents();
        return;
      }

      if (data.success) {
        alert('Student added successfully.');
        document.getElementById("studentName").value = "";
        document.getElementById("studentEmail").value = "";
        document.getElementById("studentClub").value = "";
        if (typeof loadStudents === 'function') loadStudents();
      } else {
        const err = data.error || (data.errors ? data.errors.join('\n') : 'Unknown error');
        alert('Server error: ' + err);
        console.error('insert_student error', data);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Network error while adding student.');
    });
}

function loadStudents() {
  fetch('get_students.php')
    .then(r => {
      if (!r.ok) {
        console.error('get_students failed', r.status);
        return null;
      }
      return r.json().catch(err => { console.error('get_students json parse', err); return null; });
    })
    .then(data => {
      students = data || [];
      renderStudents();
      updateStats();
    })
    .catch(err => console.error('Failed to load students:', err));
}

function renderStudents() {
  let table = document.getElementById("studentsTable");
  table.innerHTML = "";

  students.forEach(s => {

    table.innerHTML += `
      <tr>
        <td>${s.stud_id}</td>
        <td>${s.student_name}</td>
        <td>${s.email}</td>
        <td>${s.club_name}</td>
        <td><button onclick="deleteStudent(${s.stud_id})">Delete</button></td>
      </tr>
    `;
  });
}

function deleteStudent(id) {
  fetch('./delete_students.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id: id })
  })
  .then(r => {
    if (!r.ok) {
      console.error('delete_student failed', r.status);
      return r.text().then(txt => { console.error('Response:', txt); return null; });
    }
    return r.json().catch(err => { console.error('delete_student json parse', err); return null; });
  })
  .then(data => {
    if (data && data.success) {
      loadStudents();
    } else {
      const err = data ? (data.error || 'Unknown error') : 'Invalid response';
      alert('Deletion error: ' + err);
    }
  })
  .catch(err => {
    console.error('Network error deleteStudent:', err);
    alert('Network error during deletion.');
  });
}

// =====================
//      ADMINS
// =====================

function addAdmin() {
  if (!validateAdminForm()) return;

  let adminEmail = document.getElementById("adminEmail").value.trim();
  let password = document.getElementById("adminPassword").value.trim();
  let role = document.getElementById("adminRole").value.trim();
  let adminClub = document.getElementById("adminClub").value.trim();
  const fd = new FormData();
  fd.append('adminEmail', adminEmail);
  fd.append('password', password);
  fd.append('role', role);
  fd.append('adminClub', adminClub);

  fetch('http://localhost/web_dev_project2/insert_admin.php', { method: 'POST', body: fd })
    .then(r => {
      if (!r.ok) {
        return r.text().then(txt => {
          console.error('insert_admin non-ok response', r.status, txt);
          alert('Server error: ' + r.status + '\nCheck console for details.');
          return null;
        });
      }
      return r.json().catch(err => {
        console.error('Failed to parse JSON from insert_admin:', err);
        return null;
      });
    })
    .then(data => {
      if (!data) {
        console.log('insert_admin raw response not JSON or error status');
        if (typeof loadAdmins === 'function') loadAdmins();
        return;
      }

      if (data.success) {
        alert('Admin added successfully.');
        document.getElementById("adminEmail").value = "";
        document.getElementById("adminPassword").value = "";
        document.getElementById("adminRole").value = "";
        if (typeof loadAdmins === 'function') loadAdmins();
      } else {
        const err = data.error || (data.errors ? data.errors.join('\n') : 'Unknown error');
        alert('Server error: ' + err);
        console.error('insert_student error', data);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Network error while adding admin.');
    });
}
function deleteAdmin(id) {
  fetch('./delete_admin.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id: id })
  })
  .then(r => {
    if (!r.ok) {
      console.error('delete_student failed', r.status);
      return r.text().then(txt => { console.error('Response:', txt); return null; });
    }
    return r.json().catch(err => { console.error('delete_student json parse', err); return null; });
  })
  .then(data => {
    if (data && data.success) {
      loadAdmins();
    } else {
      const err = data ? (data.error || 'Unknown error') : 'Invalid response';
      alert('Deletion error: ' + err);
    }
  })
  .catch(err => {
    console.error('Network error deleteStudent:', err);
    alert('Network error during deletion.');
  });
}

function loadAdmins() {
  fetch('http://localhost/web_dev_project2/get_admins.php')
    .then(async r => {
      if (!r.ok) {
        const txt = await r.text();
        console.error('get_admins failed', r.status, txt);
        throw new Error('HTTP ' + r.status);
      }
      return r.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        console.error('Invalid admins payload:', data);
        return;
      }

      admins = data;

      if (admins.length === 0) {
        console.warn('No admins found');
        return;
      }

      renderAdmins();
    })
    .catch(err => {
      console.error('Failed to load admins:', err);
      alert('Unable to load admins');
    });
}

function validateAdminForm(){
  let adminEmail = document.getElementById("adminEmail").value.trim();
  let password = document.getElementById("adminPassword").value.trim();
  let role = document.getElementById("adminRole").value.trim();
  let adminClub= document.getElementById("adminClub").value.trim();

  if (!isValidEmail(adminEmail)) {
    alert("Invalid email address.");
    return false;
  }

  const passwordValidation = validatePassword(password);

  if (!passwordValidation.valid) {
    alert("Password validation failed:\n" + passwordValidation.errors.join("\n"));
    return false;
  }

  if (role === "") {
    alert("Please select a role.");
    return false;
  }
 if( !adminClub ){
    alert("Please select a club.");
    return false;
 }

  return true;
}

function renderAdmins() {
  let table = document.getElementById("adminsTable");
  table.innerHTML = "";

  admins.forEach(a => {

    table.innerHTML += `
      <tr>
        <td>${a.id}</td>
        <td>${a.email}</td>
        <td>${a.role}</td>
        <td>${a.club_name}</td>
        <td><button onclick="deleteAdmin(${a.id})">Delete</button></td>
      </tr>
    `;
  });
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
        select.innerHTML += `<option value="${c.name}">${c.name}</option>`;
      });
    }
  });
}

// Note: localStorage persistence removed — use server endpoints instead
// =====================
// INIT
// =====================

  const menuIcon = document.querySelector('.menu-icon');
  const sidebar= document.getElementById('sidebar');
  menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('active');
    sidebar.classList.toggle('active');
  });
// Sidebar toggle

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


function validatePassword(password) {
  const errors = [];

  if (typeof password !== "string") {
    return { valid: false, errors: ["Password must be a string"] };
  }

  if (password.length < 8) {
    errors.push("At least 8 characters");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("At least one lowercase letter");
  }

  
  if (!/[0-9]/.test(password)) {
    errors.push("At least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\/\\[\]]/.test(password)) {
    errors.push("At least one special character");
  }

  if (/\s/.test(password)) {
    errors.push("No spaces allowed");
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}


function isValidDescription(desc) {
  const trimmed = desc.trim();
  // Reset classes

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
  // Remove leading/trailing spaces
   name = name.trim();

  // Regular expression to validate name
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ -][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

  return regex.test(name) && name.length >= 2;
}

// Helper: set visual validity on an input element
function setInputValidity(elem, ok) {
  if (!elem) return;
  elem.classList.remove('valid', 'invalid');
  if (ok) {
    elem.classList.add('valid');
    try { elem.style.borderColor = '#4CAF50'; } catch(e) {}
  } else {
    elem.classList.add('invalid');
    try { elem.style.borderColor = '#E91E63'; } catch(e) {}
  }
}

// Live validation helpers for club form
function isClubNameValid(name) {
  name = (name || '').trim();
  if (name.length < 3 || name.length > 100) return false;
  return /^[\p{L}0-9\s\-]+$/u.test(name);
}

function isSlugValid(slug) {
  if (!slug) return false;
  // allow uppercase and lowercase letters, digits and hyphens
  return /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(slug);
}

function isFileValid(file) {
  if (!file) return false;
  const allowed = ['image/jpeg','image/png','image/webp'];
  if (!allowed.includes(file.type)) return false;
  if (file.size > 2 * 1024 * 1024) return false;
  return true;
}


  // load theme
  
  // If there's a form with id `clubForm`, intercept submit to use fetch (prevent default GET)
  document.addEventListener('DOMContentLoaded', () => {
loadTheme();

  // load clubs from server
  loadClubs();
  loadStudents();
  loadAdmins();
  refreshDropdowns();
  updateStats();


});




function updateStats() {
  const sc = document.getElementById("statClubs"); if (sc) sc.innerText = clubs.length;
  const se = document.getElementById("statEvents"); if (se) se.innerText = events.length;
  const ss = document.getElementById("statStudents"); if (ss) ss.innerText = students.length;
  const sa = document.getElementById("statAdmins"); if (sa) sa.innerText = admins.length;

  drawChart(); // Draw the current chart
}

let currentChartType = 'pie'; // Default to pie

function showPieChart() {
  currentChartType = 'pie';
  drawChart();
}

function showBarChart() {
  currentChartType = 'bar';
  drawChart();
}

function drawChart() {
  if (currentChartType === 'pie') {
    drawPieChart();
  } else {
    drawBarChart();
  }
}

function drawBarChart() {
  const canvas = document.getElementById("barChartCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const data = [
    { label: "Clubs",    value: clubs.length,    color: "#FFC107" },
    { label: "Events",   value: events.length,   color: "#E91E63" },
    { label: "Students", value: students.length, color: "#2196F3" },
    { label: "Admins",   value: admins.length,   color: "#4CAF50" }
  ];

  const maxValue = Math.max(...data.map(d => d.value), 1);

  const paddingBottom = 50;
  const paddingTop = 30;
  const chartHeight = canvas.height - paddingBottom - paddingTop;

  const barWidth = 60;
  const gap = 40;
  const startX = 80;

  ctx.font = "14px Arial";
  ctx.textAlign = "center";

  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = startX + index * (barWidth + gap);
    const y = canvas.height - paddingBottom - barHeight;

    // Barre
    ctx.fillStyle = item.color;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Valeur (au-dessus)
    ctx.fillStyle = "#000";
    ctx.fillText(item.value, x + barWidth / 2, y - 8);

    // Label (en dessous)
    ctx.fillText(
      item.label,
      x + barWidth / 2,
      canvas.height - paddingBottom + 20
    );
  });

  // Axe horizontal
  ctx.beginPath();
  ctx.moveTo(40, canvas.height - paddingBottom);
  ctx.lineTo(canvas.width - 20, canvas.height - paddingBottom);
  ctx.strokeStyle = "#999";
  ctx.stroke();
}

function drawPieChart() {
  const canvas = document.getElementById("chartCanvas");
  if (!canvas) return;

  // --- Correction CRITIQUE : taille réelle du canvas ---
  // (à adapter si tu veux du responsive)
  canvas.width = 350;
  canvas.height = 350;

  const ctx = canvas.getContext("2d");

  // Données
  const data = [
    clubs.length,
    events.length,
    students.length,
    admins.length
  ];

  const labels = ["Clubs", "Events", "Students", "Admins"];
  const colors = ["#4CAF50", "#2196F3", "#FFC107", "#E91E63"];

  // Nettoyage du canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const total = data.reduce((a, b) => a + b, 0);
  if (total === 0) return;

  // --- Géométrie robuste ---
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 15;

  let startAngle = 0;

  // === Dessin des parts ===
  data.forEach((value, i) => {
    if (value <= 0) return;

    const sliceAngle = (value / total) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      radius,
      startAngle,
      startAngle + sliceAngle
    );
    ctx.closePath();

    ctx.fillStyle = colors[i];
    ctx.fill();

    startAngle += sliceAngle;
  });

  // === Dessin des labels ===
  startAngle = 0;

  ctx.fillStyle = "#000";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  data.forEach((value, i) => {
    if (value <= 0) return;

    const sliceAngle = (value / total) * 2 * Math.PI;
    const labelAngle = startAngle + sliceAngle / 2;

    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.65);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.65);

    ctx.fillText(labels[i], labelX, labelY);

    startAngle += sliceAngle;
  });
}


// =====================
// SETTINGS
// =====================
function toggleTheme() {
  const body = document.body;
  const button = document.getElementById('themeToggle');
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  button.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    const button = document.getElementById('themeToggle');
    if (button) button.textContent = 'Switch to Light Mode';
  }
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
    // push event without client-generated id; DB should assign an id when persisted
    events.push({
      name,
      clubSlug,
      image: reader.result
    });

    document.getElementById("eventName").value = "";
    document.getElementById("eventImage").value = "";
    renderEvents();
    updateStats();
  };

  reader.readAsDataURL(imageInput.files[0]);
}

function renderEvents() {
  let table = document.getElementById("eventsTable");
  table.innerHTML = "";

  events.forEach((e, idx) => {
    let club = clubs.find(c => c.slug === e.clubSlug)?.name || "Unknown";

    table.innerHTML += `
      <tr>
        <td>${e.name}</td>
        <td>${club}</td>
        <td><button onclick="deleteEventAtIndex(${idx})">Delete</button></td>
      </tr>
    `;
  });
}

function deleteEventAtIndex(index) {
  if (index < 0 || index >= events.length) return;
  events.splice(index, 1);
  renderEvents();
}
// End of file

