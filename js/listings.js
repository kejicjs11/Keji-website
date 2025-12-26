async function loadHostels() {
  try {
    const res = await fetch("/api/hostels");
    const hostels = await res.json();
    const container = document.getElementById("hostel-list");
    container.innerHTML = "";

    if (hostels.length === 0) {
      container.innerHTML = "<p>No hostels available.</p>";
      return;
    }

    hostels.forEach(h => {
      const card = document.createElement("div");
      card.className = "hostel-card";
      card.innerHTML = `
        <h3>${h.name}</h3>
        <p><strong>Location:</strong> ${h.location}</p>
        <p><strong>Price:</strong> ₦${h.price}</p>
        <p>${h.description || ""}</p>
        <button>Request Inspection</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load hostels");
  }
}
loadHostels();
