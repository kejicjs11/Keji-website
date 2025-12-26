async function submitHostel() {
  const name = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const price = document.getElementById("price").value;
  const msg = document.getElementById("msg");

  msg.textContent = "Submitting...";

  try {
    const res = await fetch("/api/hostels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, location, price })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error || "Failed";
      return;
    }

    msg.textContent = "Hostel added successfully";
  } catch (err) {
    msg.textContent = "Network error";
  }
    }
