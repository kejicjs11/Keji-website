// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("hostelForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent default form submission

    const name = document.getElementById("name").value.trim();
    const location = document.getElementById("location").value.trim();
    const price = document.getElementById("price").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();

    const image1 = document.getElementById("image1").files[0];
    const image2 = document.getElementById("image2").files[0];
    const image3 = document.getElementById("image3").files[0];

    // Check required fields
    if (!name || !location || !price || !category || !description || !image1 || !image2 || !image3) {
      message.style.color = "red";
      message.innerText = "Please fill all fields and select all images.";
      return;
    }

    // Check file size <= 3MB
    const maxSize = 3 * 1024 * 1024; // 3MB
    [image1, image2, image3].forEach((img, i) => {
      if (img.size > maxSize) {
        message.style.color = "red";
        message.innerText = `Image ${i + 1} exceeds 3MB limit.`;
        return;
      }
    });

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("category", category);

      // Append images first
      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("image3", image3);

      // Then description
      formData.append("description", description);

      const res = await fetch("/api/hostels", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add hostel");
      }

      message.style.color = "green";
      message.innerText = `Hostel added successfully! ID: ${data.id}`;

      form.reset();

    } catch (err) {
      console.error(err);
      message.style.color = "red";
      message.innerText = "Failed to add hostel. Check console for details.";
    }

  });

});
