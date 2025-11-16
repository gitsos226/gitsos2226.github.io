let clubs = [];
    let events = [];
    let students = [];
    let admins = [];
    let idCounter = 1;
       

 function appear(){

 let nav=document.getElementById('sidebar');
  nav.style.display = nav.style.display === 'block' ? 'none' : 'block';

 }
    function showSection(section) {
      document.querySelectorAll("main .card").forEach(div => div.style.display = "none");
      document.getElementById(section).style.display = "block";
      refreshDropdowns();
    }

    function addClub() {
      let name = document.getElementById("clubName").value;
      if (name) {
        clubs.push({id: idCounter++, name});
        document.getElementById("clubName").value = "";
        renderClubs();
        saveToLocalStorage();
        refreshDropdowns();
      }
    }

    //Permet d'afficher les clubs actuels qui sont dans le tableau clubs[]
    function renderClubs() {
      let table = document.getElementById("clubsTable");
      table.innerHTML = "";
      clubs.forEach(c => {
        table.innerHTML += `<tr>
          <td>${c.id}</td>
          <td>${c.name}</td>
          <td><button onclick="deleteClub(${c.id})">Delete</button></td>
        </tr>`;
      });
    }

    function deleteClub(id) {
      clubs = clubs.filter(c => c.id !== id);
      renderClubs();
      saveToLocalStorage();
      refreshDropdowns();
    }

    function addEvent() {
      let name = document.getElementById("eventName").value;
      let clubId = document.getElementById("eventClub").value;
      if (name && clubId) {
        events.push({id: idCounter++, name, clubId});
        document.getElementById("eventName").value = "";
        saveToLocalStorage();
        renderEvents();
      }
    }

    function renderEvents() {
      let table = document.getElementById("eventsTable");
      table.innerHTML = "";
      events.forEach(e => {
        let club = clubs.find(c => c.id == e.clubId)?.name || "N/A";
        table.innerHTML += `<tr>
          <td>${e.id}</td>
          <td>${e.name}</td>
          <td>${club}</td>
          <td><button onclick="deleteEvent(${e.id})">Supprimer</button></td>
        </tr>`;
      });
    }

    function deleteEvent(id) {
      events = events.filter(e => e.id !== id);
      renderEvents();
      saveToLocalStorage();
    }

   function addStudent() {
  let name = document.getElementById("studentName").value;
  let email = document.getElementById("studentEmail").value;
  let clubId = document.getElementById("studentClub").value;
  if (name && email && clubId) {
    students.push({id: idCounter++, name, email, clubId});
    document.getElementById("studentName").value = "";
    document.getElementById("studentEmail").value = "";
    saveToLocalStorage();
    renderStudents();
  }
}

    function renderStudents() {
  let table = document.getElementById("studentsTable");
  table.innerHTML = "";
  students.forEach(s => {
    let club = clubs.find(c => c.id == s.clubId)?.name || "N/A";
    table.innerHTML += `<tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.email || ''}</td>
      <td>${club}</td>
      <td><button onclick="deleteStudent(${s.id})">Supprimer</button></td>
    </tr>`;
  });
}

    function deleteStudent(id) {
      students = students.filter(s => s.id !== id);
      renderStudents();
      saveToLocalStorage();
    }

    function addAdmin() {
      let name = document.getElementById("adminName").value;
      let clubId = document.getElementById("adminClub").value;
      if (name && clubId) {
        admins.push({id: idCounter++, name, clubId});
        document.getElementById("adminName").value = "";
        saveToLocalStorage();
        renderAdmins();
      }
    }

    function renderAdmins() {
      let table = document.getElementById("adminsTable");
      table.innerHTML = "";
      admins.forEach(a => {
        let club = clubs.find(c => c.id == a.clubId)?.name || "N/A";
        table.innerHTML += `<tr>
          <td>${a.id}</td>
          <td>${a.name}</td>
          <td>${club}</td>
          <td><button onclick="deleteAdmin(${a.id})">Supprimer</button></td>
        </tr>`;
      });
    }

    function deleteAdmin(id) {
      admins = admins.filter(a => a.id !== id);
      renderAdmins();
      saveToLocalStorage();
    }

    function refreshDropdowns() {
      ["eventClub", "studentClub", "adminClub"].forEach(selectId => {
        let select = document.getElementById(selectId);
        if (select) {
          select.innerHTML = "";
          clubs.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
          });
        }
      });
    }

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
     function saveToLocalStorage(){

        localStorage.setItem('clubs', JSON.stringify(clubs));
        localStorage.setItem('events', JSON.stringify(events));
      localStorage.setItem('students', JSON.stringify(students));
      localStorage.setItem('admins', JSON.stringify(admins));
    localStorage.setItem('idCounter', idCounter.toString());

     }
     function loadFromLocalStorage(){
    const savedClubs=localStorage.getItem('clubs');
    const savedEvents=localStorage.getItem('events');
    const savedStudents=localStorage.getItem('students');
    const savedAdmins=localStorage.getItem('admins');
    const savedIdCounter=localStorage.getItem('idCounter');

if (savedClubs) clubs = JSON.parse(savedClubs);
  if (savedEvents) events = JSON.parse(savedEvents);
  if (savedStudents) students = JSON.parse(savedStudents);
  if (savedAdmins) admins = JSON.parse(savedAdmins);
  if (savedIdCounter) idCounter = parseInt(savedIdCounter);
}

     


document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  renderClubs();
  renderEvents();
  renderStudents();
  renderAdmins();
  refreshDropdowns();
});