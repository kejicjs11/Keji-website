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

function applyFilters() {
  const typeValue = document.getElementById("typeFilter").value;
  const locationValue = document.getElementById("locationFilter").value;
  const priceValue = document.getElementById("priceFilter").value;

  const [minPrice, maxPrice] = priceValue ? priceValue.split("-").map(Number) : [0, Infinity];

  document.querySelectorAll(".listing-card").forEach(card => {
    const cardType = card.getAttribute("data-type");
    const cardLocation = card.getAttribute("data-location");
    const cardPrice = Number(card.getAttribute("data-price"));

    const typeMatch = !typeValue || cardType === typeValue;
    const locationMatch = !locationValue || cardLocation === locationValue;
    const priceMatch = !priceValue || (cardPrice >= minPrice && cardPrice <= maxPrice);

    if (typeMatch && locationMatch && priceMatch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Attach event listeners
document.getElementById("typeFilter").addEventListener("change", applyFilters);
document.getElementById("locationFilter").addEventListener("change", applyFilters);
document.getElementById("priceFilter").addEventListener("change", applyFilters);
