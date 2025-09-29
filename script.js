// DOM Elements
const form = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountEl = document.getElementById("attendeeCount");
const waterCountEl = document.getElementById("waterCount");
const zeroCountEl = document.getElementById("zeroCount");
const powerCountEl = document.getElementById("powerCount");
const progressBar = document.getElementById("progressBar");

// Constants
const MAX_ATTENDEES = 50;

// State (load from localStorage if available)
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0,
};

// Initialize page with saved data
function init() {
  updateCounts();
  renderAttendeeList();
}
init();

// Form submit handler
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = attendeeNameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return;

  // Check for duplicate by case-insensitive name
  const alreadyExists = attendees.some(
    (att) => att.name.toLowerCase() === name.toLowerCase()
  );

  if (alreadyExists) {
    renderError(`${name} is already checked in and cannot register again.`);
    return;
  }

  // Save attendee
  attendees.push({ name, team });
  teamCounts[team]++;

  // Persist to localStorage
  saveProgress();

  // Update UI
  updateCounts();
  renderGreeting(name, team);
  renderAttendeeList();

  // Reset form
  form.reset();

  // Check celebration
  checkCelebration();
});

// Update counters and progress bar
function updateCounts() {
  const total = attendees.length;
  attendeeCountEl.textContent = total;

  waterCountEl.textContent = teamCounts.water;
  zeroCountEl.textContent = teamCounts.zero;
  powerCountEl.textContent = teamCounts.power;

  const progress = Math.min((total / MAX_ATTENDEES) * 100, 100);
  progressBar.style.width = `${progress}%`;
}

// Personalized greeting
function renderGreeting(name, team) {
  const teamNames = {
    water: "🌊 Team Water Wise",
    zero: "🌿 Team Net Zero",
    power: "⚡ Team Renewables",
  };

  greeting.textContent = `Welcome, ${name}! You're checked in with ${teamNames[team]}.`;
  greeting.className = "success-message";
  greeting.style.display = "block";
}

// Error message
function renderError(message) {
  greeting.textContent = message;
  greeting.className = "error-message";
  greeting.style.display = "block";
}

// Celebration feature
function checkCelebration() {
  if (attendees.length === MAX_ATTENDEES) {
    // Determine winning team
    let winner = "No team yet";
    let max = 0;
    for (let team in teamCounts) {
      if (teamCounts[team] > max) {
        max = teamCounts[team];
        winner = team;
      }
    }

    const teamNames = {
      water: "🌊 Team Water Wise",
      zero: "🌿 Team Net Zero",
      power: "⚡ Team Renewables",
    };

    alert(
      `🎉 Attendance goal reached! Congratulations ${teamNames[winner]} for leading with ${max} attendees!`
    );
  }
}

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem("attendees", JSON.stringify(attendees));
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
}

// Render attendee list
function renderAttendeeList() {
  let listContainer = document.getElementById("attendeeList");

  // Create container if not already present
  if (!listContainer) {
    listContainer = document.createElement("div");
    listContainer.id = "attendeeList";
    listContainer.style.marginTop = "20px";
    listContainer.style.textAlign = "left";
    document.querySelector(".team-stats").appendChild(listContainer);
  }

  listContainer.innerHTML = "<h4>Attendee List</h4><ul></ul>";
  const ul = listContainer.querySelector("ul");

  attendees.forEach((attendee) => {
    const li = document.createElement("li");
    li.textContent = `${attendee.name} — ${
      attendee.team === "water"
        ? "🌊 Team Water Wise"
        : attendee.team === "zero"
        ? "🌿 Team Net Zero"
        : "⚡ Team Renewables"
    }`;
    ul.appendChild(li);
  });
}
