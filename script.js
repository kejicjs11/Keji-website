const params = new URLSearchParams(window.location.search);
const agentName = params.get("agent");

if (agentName) {
  const title = document.getElementById("chatTitle");
  if (title) {
    title.textContent = "Chat with " + agentName;
  }
}

// ----- CHAT PAGE SAFE LOGIC -----

document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chatBox");
  const input = document.getElementById("messageInput");

  // If this page has no chat, stop here safely
  if (!chatBox || !input) return;

  // Display agent name
  const params = new URLSearchParams(window.location.search);
  const agentName = params.get("agent");
  const title = document.getElementById("chatTitle");

  if (agentName && title) {
    title.textContent = "Chat with " + agentName;
  }

  // Load saved chat for this agent
  const storageKey = agentName
    ? "abrakaChat_" + agentName
    : "abrakaChat_default";

  const savedChat = localStorage.getItem(storageKey);
  if (savedChat) {
    chatBox.innerHTML = savedChat;
  }

  // Send message function (GLOBAL)
  window.sendMessage = function () {
    if (input.value.trim() === "") return;

    const msg = document.createElement("div");
    msg.className = "message user";
    msg.textContent = input.value;

    chatBox.appendChild(msg);
    localStorage.setItem(storageKey, chatBox.innerHTML);

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  };

});
