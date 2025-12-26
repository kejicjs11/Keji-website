// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("hostelForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent default form submission

    const name = document.getElementById("name").value.trim();
    const location = document.getElementById("location").value.trim();
    const price = document.getElementById("price").value.trim();

    if (!name || !location || !price) {
      message.innerText = "Please fill all fields";
      return;
    }

    try {
      const res = await fetch("/api/hostels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, price })
      });

      if (!res.ok) {
        const error = await res.text();
        message.innerText = `Error: ${error}`;
        return;
      }

      const data = await res.json();
      message.innerText = `Hostel added successfully! ID: ${data.id}`;

      // Clear the form
      form.reset();

    } catch (err) {
      console.error(err);
      message.innerText = "Failed to add hostel. Check console for details.";
    }

  });

});
