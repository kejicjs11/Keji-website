const params = new URLSearchParams(window.location.search);
const listingName = params.get("listing") || "general";

const storageKey = "abrakaChat_" + listingName;

const savedChat = localStorage.getItem(storageKey);
if (savedChat) {
  document.getElementById("chatBox").innerHTML = savedChat;
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const chatBox = document.getElementById("chatBox");

  if (input.value.trim() === "") return;

  const msg = document.createElement("div");
  msg.className = "message user";
  msg.textContent = input.value;

  chatBox.appendChild(msg);
  localStorage.setItem(storageKey, chatBox.innerHTML);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chat-box");
  const input = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");

  const params = new URLSearchParams(window.location.search);
  const agentName = params.get("agent") || "Agent";

  document.getElementById("chat-title").textContent =
    "Chat with " + agentName;

  const storageKey = "chat_" + agentName;
  let messages = JSON.parse(localStorage.getItem(storageKey)) || [];

  function renderMessages() {
    chatBox.innerHTML = "";
    messages.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message " + msg.sender;
      div.textContent = msg.text;
      chatBox.appendChild(div);
    });
  }

  sendBtn.addEventListener("click", () => {
    if (input.value.trim() === "") return;

    messages.push({ sender: "user", text: input.value });
    localStorage.setItem(storageKey, JSON.stringify(messages));
    input.value = "";
    renderMessages();
  });

  renderMessages();
});
