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

document.getElementById("searchInput").addEventListener("input", () => {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();

  document.querySelectorAll(".listing-card").forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const agentName = card.querySelector(".whatsapp-btn").textContent.toLowerCase();

    if (title.includes(searchValue) || agentName.includes(searchValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});
