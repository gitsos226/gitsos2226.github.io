function addmember() {
  
  if (!validateStudentForm()) return;
let fname = document.getElementById("student_fname").value.trim();
  let lname = document.getElementById("student_lname").value.trim();
 let studentClub = document.getElementById("studentClub").value.trim();
  let email = document.getElementById("studentEmail").value.trim();
  const fd = new FormData();
  fd.append('studentClub', studentClub);
  fd.append('studentEmail', email);
  fd.append('student_fname', fname);
  fd.append('student_lname', lname);
  fetch('insert_member.php', { method: 'POST', body: fd })
    .then(r => {

      if (!r.ok) {
        return r.text().then(txt => {
          console.error('insert_member non-ok response', r.status, txt);
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
        alert('member added successfully.');
        document.getElementById("studentName").value = "";
        document.getElementById("studentEmail").value = "";
        document.getElementById("studentClub").value = "";
        if (typeof loadStudents === 'function') loadStudents();
      } else {
        const err = data.error || (data.errors ? data.errors.join('\n') : 'Unknown error');
        alert('Server error: ' + err);
        console.error('insert_member error', data);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Network error while adding student.');
    });
}

