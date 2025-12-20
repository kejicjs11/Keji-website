// Load saved chat
const savedChat = localStorage.getItem("abrakaChat");
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

  // Save chat
  localStorage.setItem("abrakaChat", chatBox.innerHTML);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
