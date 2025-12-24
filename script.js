// 1. Get listing name from URL
const params = new URLSearchParams(window.location.search);
const listingName = params.get("listing") || "general";

// 2. Create unique storage key per listing
const storageKey = "abrakaChat_" + listingName;

// 3. Load saved chat (if any)
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");

const savedChat = localStorage.getItem(storageKey);
if (savedChat) {
  chatBox.innerHTML = savedChat;
}

// 4. Send message function
function sendMessage() {
  if (input.value.trim() === "") return;

  const msg = document.createElement("div");
  msg.className = "message user";
  msg.textContent = input.value;

  chatBox.appendChild(msg);

  // Save chat for THIS listing only
  localStorage.setItem(storageKey, chatBox.innerHTML);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
    }

document.getElementById("chatTitle").textContent =
  "Chat about " + listingName;

const form = document.getElementById("marketForm");
const listDiv = document.getElementById("marketList");

let items = JSON.parse(localStorage.getItem("studentItems")) || [];

function renderItems() {
  listDiv.innerHTML = "";
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <p>₦${item.price}</p>
      <a href="https://wa.me/${item.contact}" target="_blank">Contact Seller</a>
    `;
    listDiv.appendChild(card);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const newItem = {
    name: document.getElementById("itemName").value,
    desc: document.getElementById("itemDesc").value,
    price: document.getElementById("itemPrice").value,
    contact: document.getElementById("itemContact").value
  };
  items.push(newItem);
  localStorage.setItem("studentItems", JSON.stringify(items));
  renderItems();
  form.reset();
});

renderItems();

// List of hostels with coordinates
const hostels = [
  { name: "Peace Hostel", lat: 5.7512, lng: 5.8912, type: "hostel" },
  { name: "Royal Lodge", lat: 5.7525, lng: 5.8920, type: "self-contained" }
];

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 5.7512, lng: 5.8912 }
  });

  hostels.forEach(h => {
    const marker = new google.maps.Marker({
      position: { lat: h.lat, lng: h.lng },
      map: map,
      title: h.name
    });

    const info = new google.maps.InfoWindow({
      content: `<h3>${h.name}</h3><p>Type: ${h.type}</p>`
    });

    marker.addListener("click", () => info.open(map, marker));
  });
}
