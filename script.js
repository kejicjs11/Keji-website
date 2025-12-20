document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const listing = params.get("listing") || "general";
  const storageKey = "abrakaChat_" + listing;

  const chatBox = document.getElementById("chat-box");
  const input = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");

  let messages = JSON.parse(localStorage.getItem(storageKey)) || [];

  function renderMessages() {
    chatBox.innerHTML = "";
    messages.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message user";
      div.textContent = msg;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;

    messages.push(text);
    localStorage.setItem(storageKey, JSON.stringify(messages));

    input.value = "";
    renderMessages();
  });

  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendBtn.click();
  });

  renderMessages();
});
