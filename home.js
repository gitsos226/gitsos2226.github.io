// ======== STATIC CLUBS LIST ========
const clubs = {
  escc: "ENSIA Sport & Culture Club",
  gdg: "Google Developer Group",
  ebec: "ENSIA Business and Engineering Club",
  skilltell: "Skill & Tell",
  secai: "Security & Artificial Intelligence Club",
  etc: "ENSIA Tech Community"
};

// ======== SETUP STATIC CLUBS ========
function setupStaticClubs() {
  document.querySelectorAll(".club-card").forEach(card => {
    const clubId = card.dataset.club;
    const joinBtn = card.querySelector(".join-btn");
    const leaveBtn = card.querySelector(".leave-btn");
    const clubImg = card.querySelector(".club-image");

    const isMember = localStorage.getItem(`${clubId}_isMember`) === "true";

    // show correct button
    joinBtn.style.display = isMember ? "none" : "inline-block";
    leaveBtn.style.display = isMember ? "inline-block" : "none";

    // join
    joinBtn.addEventListener("click", () => {
      localStorage.setItem("selectedClub", clubId);
      window.location.href = "formpage.html";
    });

    // leave
    leaveBtn.addEventListener("click", () => {
      localStorage.setItem(`${clubId}_isMember`, "false");
      alert("You left the club!");
      window.location.reload();
    });

    // clicking image
    clubImg.addEventListener("click", () => {
      if (isMember) {
        const clubName = clubs[clubId];
        window.location.href = `${clubName}.html`;
      } else {
        alert("Please join the club to access this page.");
        localStorage.setItem("selectedClub", clubId);
        window.location.href = "formpage.html";
      }
    });
  });
}

// ======== DISPLAY NEWLY ADDED CLUB ========
function displayClubs() {
  const clubName = localStorage.getItem("clubName");
  const clubId = localStorage.getItem("clubId");
  const clubImage = localStorage.getItem("clubImage");
  const clubDescription = localStorage.getItem("clubDescription");

  if (!clubName || !clubId || !clubImage || !clubDescription) return;

  const container = document.querySelector(".clubs-section");
  const div = document.createElement("div");
  div.classList.add("club-card");
  div.dataset.club = clubId;

  div.innerHTML = `
        <img src="${clubImage}" class="club-image" />
        <p class="club-title">${clubName} (${clubId.toUpperCase()})</p>
        <p class="club-desc">${clubDescription}</p>
        <div>
            <button class="join-btn">Join ${clubId.toUpperCase()}</button>
            <button class="leave-btn">Leave ${clubId.toUpperCase()}</button>
        </div>
    `;

  container.appendChild(div);

  // Apply the same interactions as static clubs
  setupStaticClubs();
}

// ======== DISPLAY NEWLY ADDED EVENT ========
function displayEvent() {
  const eventName = localStorage.getItem("eventName");
  const eventDesc = localStorage.getItem("eventDesc");
  const eventImage = localStorage.getItem("eventImage");

  if (!eventName || !eventDesc || !eventImage) return;

  const container = document.querySelector(".events-section");
  const div = document.createElement("div");
  div.classList.add("event-card");

  div.innerHTML = `
      <img src="${eventImage}" class="event-img" />
      <p class="event-title">${eventName}</p>
      <p class="event-desc">${eventDesc}</p>
  `;

  container.appendChild(div);
}

// ======== MAIN STARTUP ========
document.addEventListener("DOMContentLoaded", () => {
  setupStaticClubs(); // static cards
  displayClubs();     // dynamic clubs
  displayEvent();     // dynamic events
});
