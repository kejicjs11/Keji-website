document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const input = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");

  let messages = JSON.parse(localStorage.getItem("abrakaChat")) || [];

  function renderMessages() {
    chatBox.innerHTML = "";
    messages.forEach(msg => {
      const div = document.createElement("div");
      div.classList.add("message", msg.sender);
      div.textContent = msg.text;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    messages.push({ sender: "user", text });
    localStorage.setItem("abrakaChat", JSON.stringify(messages));

    input.value = "";
    renderMessages();
  }

  renderMessages();
});
