/* ============================================================
   main.js — Community Event Portal
   JavaScript Exercises 1–14
   ============================================================ */

/* ── Exercise 1: Basics & Setup ─────────────────────────── */
console.log("Welcome to the Community Portal");

window.addEventListener("load", function () {
  alert("Page fully loaded! Welcome to the Community Event Portal.");
  initDataTypes();   // Ex 2
  renderSearchHandler(); // Ex 8
  initJQuery();      // Ex 14
});

// Show/hide sections
function showSection(id) {
  document.querySelectorAll("main > section").forEach(s => s.style.display = "none");
  document.getElementById("sec-" + id).style.display = "block";
}

/* ── Exercise 2: Data Types & Operators ─────────────────── */
function initDataTypes() {
  const eventName = "Tech Meetup";      // const for immutable
  const eventDate = "2025-06-10";       // const
  let seats = 50;                       // let for mutable value

  // Template literals
  let info = `Event: ${eventName} | Date: ${eventDate} | Seats: ${seats}`;
  console.log(info);

  // Manage seat count with ++ / --
  seats--;  // someone registered
  console.log(`Seats remaining: ${seats}`);

  document.getElementById("dataTypesOutput").innerHTML = `
    <p><strong>Event Name (const):</strong> ${eventName}</p>
    <p><strong>Event Date (const):</strong> ${eventDate}</p>
    <p><strong>Seats (let, after 1 registration):</strong> ${seats}</p>
    <p><strong>Template Literal:</strong> ${info}</p>
  `;
}

/* ── Exercise 3: Conditionals, Loops & Error Handling ──── */

// Sample event data used across exercises
const allEvents = [
  { id: 1, name: "Tech Meetup",      date: "2025-06-10", seats: 20, category: "tech",   past: false },
  { id: 2, name: "AI Conference",    date: "2024-05-15", seats: 0,  category: "tech",   past: true  },
  { id: 3, name: "Frontend Bootcamp",date: "2025-07-01", seats: 15, category: "tech",   past: false },
  { id: 4, name: "Baking Workshop",  date: "2025-07-05", seats: 10, category: "baking", past: false },
  { id: 5, name: "Music Night",      date: "2025-07-20", seats: 0,  category: "music",  past: false },
  { id: 6, name: "Old Art Show",     date: "2023-03-01", seats: 5,  category: "art",    past: true  },
];

function renderEventList() {
  const container = document.getElementById("eventListOutput");
  container.innerHTML = "";

  try {
    allEvents.forEach(event => {
      // Conditionals: hide past or full events
      if (event.past) return;
      if (event.seats <= 0) {
        container.innerHTML += `<div class="event-card" style="background:#fff3cd">
          <div><h3>${event.name}</h3><p>${event.date} — <em>Full</em></p></div>
        </div>`;
        return;
      }
      container.innerHTML += `<div class="event-card">
        <div><h3>${event.name}</h3><p>${event.date} | Seats: ${event.seats}</p></div>
        <button class="btn btn-primary" onclick="registerForEvent(${event.id})">Register</button>
      </div>`;
    });
  } catch (err) {
    console.error("Error rendering events:", err);
    container.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
}

function registerForEvent(id) {
  try {
    const event = allEvents.find(e => e.id === id);
    if (!event) throw new Error("Event not found");
    if (event.seats <= 0) throw new Error("No seats available");
    event.seats--;
    alert(`Registered for "${event.name}"! Seats left: ${event.seats}`);
    renderEventList();
  } catch (err) {
    alert("Registration error: " + err.message);
  }
}

/* ── Exercise 4: Functions, Closures & HOF ──────────────── */

function addEvent(name, date, category, seats) {
  const newEvent = { id: allEvents.length + 1, name, date, category, seats, past: false };
  allEvents.push(newEvent);
  return newEvent;
}

function registerUser(userName, eventId) {
  const event = allEvents.find(e => e.id === eventId);
  if (!event || event.seats <= 0) return false;
  event.seats--;
  console.log(`${userName} registered for ${event.name}`);
  return true;
}

function filterEventsByCategory(category, callback) {
  return allEvents.filter(e => callback(e, category));
}

// Closure: track total registrations per category
function makeRegistrationTracker() {
  const counts = {};
  return function track(category) {
    counts[category] = (counts[category] || 0) + 1;
    return counts[category];
  };
}
const trackRegistration = makeRegistrationTracker();

document.addEventListener("DOMContentLoaded", function () {
  const catFilter = document.getElementById("catFilter");
  if (catFilter) {
    catFilter.addEventListener("change", function () {
      const cat = this.value;
      const output = document.getElementById("funcOutput");
      const filtered = cat
        ? filterEventsByCategory(cat, (e, c) => e.category === c)
        : allEvents;
      output.innerHTML = filtered
        .map(e => `<div class="event-card"><h3>${e.name}</h3><p>${e.category} | ${e.date}</p></div>`)
        .join("");
      if (cat) {
        const count = trackRegistration(cat);
        document.getElementById("totalReg").textContent =
          `Total times "${cat}" was selected (this session): ${count}`;
      }
    });
  }
});

/* ── Exercise 5: Objects & Prototypes ───────────────────── */

// Constructor function
function Event(id, name, date, category, seats) {
  this.id = id;
  this.name = name;
  this.date = date;
  this.category = category;
  this.seats = seats;
}

// Prototype method
Event.prototype.checkAvailability = function () {
  return this.seats > 0
    ? `"${this.name}" has ${this.seats} seat(s) available.`
    : `"${this.name}" is fully booked.`;
};

// ES6 Class version
class EventClass {
  constructor(id, name, date, category, seats) {
    this.id = id; this.name = name; this.date = date;
    this.category = category; this.seats = seats;
  }
  checkAvailability() {
    return this.seats > 0
      ? `${this.name}: ${this.seats} seats available`
      : `${this.name}: Fully booked`;
  }
}

function demoObjects() {
  const e1 = new Event(1, "Tech Meetup", "2025-06-10", "tech", 20);
  const e2 = new EventClass(2, "Music Night", "2025-07-20", "music", 0);

  const entries = Object.entries(e1).map(([k, v]) => `${k}: ${v}`).join("\n");

  document.getElementById("objOutput").textContent =
    `-- Constructor-based Object --\n${entries}\n\n` +
    `checkAvailability(): ${e1.checkAvailability()}\n\n` +
    `-- ES6 Class Object --\n` +
    `checkAvailability(): ${e2.checkAvailability()}\n\n` +
    `Object.keys(e1): [${Object.keys(e1).join(", ")}]\n` +
    `Object.values(e1): [${Object.values(e1).join(", ")}]`;
}

/* ── Exercise 6: Arrays & Methods ───────────────────────── */

function demoArrays() {
  let events = [...allEvents]; // spread clone

  // push: add new event
  events.push({ id: 99, name: "New Jazz Festival", date: "2025-08-01", category: "music", seats: 30, past: false });

  // filter: only music events
  const musicEvents = events.filter(e => e.category === "music");

  // map: format display cards
  const cards = events.map(e => `🎫 ${e.name} (${e.category})`);

  document.getElementById("arrOutput").textContent =
    `-- All Events (after push) --\n${events.map(e => e.name).join("\n")}\n\n` +
    `-- Music Events (filter) --\n${musicEvents.map(e => e.name).join("\n")}\n\n` +
    `-- Display Cards (map) --\n${cards.join("\n")}`;
}

/* ── Exercise 7: DOM Manipulation ───────────────────────── */

function renderDOMEvents() {
  const container = document.querySelector("#domEventCards");
  container.innerHTML = "";

  allEvents.forEach(event => {
    // createElement
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <div>
        <h3>${event.name} <span class="tag">${event.category}</span></h3>
        <p>${event.date} | Seats: ${event.seats}</p>
      </div>
      <div>
        <button class="btn btn-primary" data-id="${event.id}" onclick="domRegister(${event.id}, this)">Register</button>
        <button class="btn btn-danger" style="margin-left:6px;" onclick="domCancel(${event.id}, this)">Cancel</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function domRegister(id, btn) {
  const event = allEvents.find(e => e.id === id);
  if (!event || event.seats <= 0) return alert("No seats available!");
  event.seats--;
  // Update UI
  btn.closest(".event-card").querySelector("p").textContent =
    `${event.date} | Seats: ${event.seats} ✅ Registered`;
}

function domCancel(id, btn) {
  const event = allEvents.find(e => e.id === id);
  if (!event) return;
  event.seats++;
  btn.closest(".event-card").querySelector("p").textContent =
    `${event.date} | Seats: ${event.seats} ❌ Cancelled`;
}

/* ── Exercise 8: Event Handling ─────────────────────────── */

function renderSearchHandler() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  // keydown: quick search by name
  input.addEventListener("keydown", function () {
    const q = this.value.toLowerCase();
    const out = document.getElementById("eventHandlerOutput");
    const results = allEvents.filter(e => e.name.toLowerCase().includes(q));
    out.innerHTML = results.length
      ? results.map(e => `<div class="event-card">
          <div><h3>${e.name}</h3><p>${e.date} | ${e.category}</p></div>
          <button class="btn btn-primary" onclick="registerForEvent(${e.id})">Register</button>
        </div>`).join("")
      : "<p>No events found.</p>";
  });
}

function filterByCategory() {
  const cat = document.getElementById("catSelect").value;
  const out = document.getElementById("eventHandlerOutput");
  const results = cat ? allEvents.filter(e => e.category === cat) : allEvents;
  out.innerHTML = results.map(e => `<div class="event-card">
    <div><h3>${e.name}</h3><p>${e.date} | ${e.category}</p></div>
  </div>`).join("");
}

/* ── Exercise 9: Async JS, Promises, Async/Await ────────── */

// Mock API URL (JSONPlaceholder as stand-in)
const MOCK_API = "https://jsonplaceholder.typicode.com/posts?_limit=3";

function fetchWithPromise() {
  const out = document.getElementById("asyncOutput");
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";
  out.innerHTML = "";

  fetch(MOCK_API)
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      spinner.style.display = "none";
      out.innerHTML = "<strong>Promise Result (mock events):</strong>" +
        data.map(d => `<div class="event-card"><h3>${d.title.slice(0,40)}...</h3></div>`).join("");
    })
    .catch(err => {
      spinner.style.display = "none";
      out.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    });
}

async function fetchWithAsync() {
  const out = document.getElementById("asyncOutput");
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";
  out.innerHTML = "";

  try {
    const res = await fetch(MOCK_API);
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    spinner.style.display = "none";
    out.innerHTML = "<strong>Async/Await Result:</strong>" +
      data.map(d => `<div class="event-card"><h3>${d.title.slice(0,40)}...</h3></div>`).join("");
  } catch (err) {
    spinner.style.display = "none";
    out.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
}

/* ── Exercise 10: Modern JavaScript Features ─────────────── */

function demoModernJS() {
  // Default parameters
  function createEvent(name, category = "general", seats = 50) {
    return { name, category, seats };
  }

  // Destructuring
  const eventData = { name: "Art Fair", category: "art", date: "2025-08-15", seats: 30 };
  const { name, category, date } = eventData;

  // Spread: clone before filtering
  const cloned = [...allEvents];
  const techOnly = cloned.filter(e => e.category === "tech");

  // Arrow functions, template literals
  const summary = techOnly.map(e => `${e.name} on ${e.date}`);

  document.getElementById("modernOutput").textContent =
    `-- Default Parameters --\n${JSON.stringify(createEvent("Music Gala"), null, 2)}\n\n` +
    `-- Destructuring --\nname: ${name}, category: ${category}, date: ${date}\n\n` +
    `-- Spread + Filter --\nTech events: ${summary.join(" | ")}`;
}

/* ── Exercise 11: Working with Forms ─────────────────────── */

function handleFormSubmit(e) {
  e.preventDefault(); // prevent default
  const form = e.target;
  const name  = form.elements["name"].value.trim();
  const email = form.elements["email"].value.trim();
  const event = form.elements["event"].value;

  // Clear errors
  ["nameErr","emailErr","eventErr"].forEach(id => document.getElementById(id).textContent = "");
  let valid = true;

  if (!name) {
    document.getElementById("nameErr").textContent = "Name is required.";
    valid = false;
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    document.getElementById("emailErr").textContent = "Valid email is required.";
    valid = false;
  }
  if (!event) {
    document.getElementById("eventErr").textContent = "Please select an event.";
    valid = false;
  }
  if (valid) {
    document.getElementById("formMsg").textContent =
      `✅ ${name} registered for "${event}" (${email})`;
    form.reset();
  }
}

/* ── Exercise 12: AJAX & Fetch API ───────────────────────── */

function postRegistration() {
  const msg = document.getElementById("ajaxMsg");
  msg.textContent = "⏳ Submitting...";
  msg.style.color = "#007BFF";

  const userData = { name: "Test User", email: "test@example.com", event: "tech" };

  // Simulate POST with JSONPlaceholder
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  })
  .then(res => res.json())
  .then(data => {
    // Simulate delayed response
    setTimeout(() => {
      console.log("Registration payload:", userData);
      console.log("Server response:", data);
      msg.textContent = `✅ Registration successful! Server ID: ${data.id}`;
      msg.style.color = "green";
    }, 1000);
  })
  .catch(err => {
    msg.textContent = `❌ Error: ${err.message}`;
    msg.style.color = "red";
  });
}

/* ── Exercise 13: Debugging ─────────────────────────────── */

function debugDemo() {
  const out = document.getElementById("debugOutput");
  let log = "";

  // Step 1
  const step1 = "Step 1: Collecting form data...";
  console.log(step1);
  log += step1 + "\n";

  // Step 2
  const payload = { name: "Alice", email: "alice@test.com", event: "tech" };
  const step2 = `Step 2: Payload = ${JSON.stringify(payload)}`;
  console.log(step2);
  log += step2 + "\n";

  // Step 3
  const step3 = "Step 3: Sending fetch request to mock API...";
  console.log(step3);
  log += step3 + "\n";

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    const step4 = `Step 4: Response received — ID: ${data.id}`;
    console.log(step4);
    log += step4 + "\n✅ Debug demo complete. Check Network tab in DevTools!";
    out.textContent = log;
  })
  .catch(err => {
    console.error("Fetch error:", err);
    log += `❌ Fetch error: ${err.message}`;
    out.textContent = log;
  });

  out.textContent = log;
}

/* ── Exercise 14: jQuery ─────────────────────────────────── */

function initJQuery() {
  if (typeof $ === "undefined") return;

  // Click handler
  $("#registerBtn").click(function () {
    $("#jqMsg").text("✅ Registered via jQuery click handler!");
    $("#jqCard").fadeIn(500);
  });
}