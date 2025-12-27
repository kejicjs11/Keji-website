document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("hostelForm");
  const message = document.getElementById("message");

  // Create preview containers
  const previewContainer = document.createElement("div");
  previewContainer.id = "imagePreviews";
  previewContainer.style.display = "flex";
  previewContainer.style.gap = "10px";
  previewContainer.style.margin = "10px 0";
  form.insertBefore(previewContainer, document.getElementById("description"));

  const imageInputs = [
    document.getElementById("image1"),
    document.getElementById("image2"),
    document.getElementById("image3")
  ];

  // Function to show image previews
  const showPreview = (input, index) => {
    input.addEventListener("change", () => {
      const file = input.files[0];
      const existingImg = document.getElementById(`preview${index}`);
      if (existingImg) existingImg.remove();

      if (file) {
        if (file.size > 3 * 1024 * 1024) {
          message.style.color = "red";
          message.innerText = `Image ${index + 1} exceeds 3MB limit.`;
          input.value = "";
          return;
        }
        const img = document.createElement("img");
        img.id = `preview${index}`;
        img.src = URL.createObjectURL(file);
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.objectFit = "cover";
        img.style.border = "1px solid #ccc";
        img.style.borderRadius = "5px";
        previewContainer.appendChild(img);
      }
    });
  };

  imageInputs.forEach((input, i) => showPreview(input, i + 1));

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const location = document.getElementById("location").value.trim();
    const price = document.getElementById("price").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();

    const [image1, image2, image3] = imageInputs.map(inp => inp.files[0]);

    if (!name || !location || !price || !category || !description || !image1 || !image2 || !image3) {
      message.style.color = "red";
      message.innerText = "Please fill all fields and select all images.";
      return;
    }

    const maxSize = 3 * 1024 * 1024;
    for (let i = 0; i < 3; i++) {
      if ([image1, image2, image3][i].size > maxSize) {
        message.style.color = "red";
        message.innerText = `Image ${i + 1} exceeds 3MB limit.`;
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("image3", image3);
      formData.append("description", description);

      const res = await fetch("/api/hostels", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add hostel");

      message.style.color = "green";
      message.innerText = `Hostel added successfully! ID: ${data.id}`;

      form.reset();
      previewContainer.innerHTML = "";

    } catch (err) {
      console.error(err);
      message.style.color = "red";
      message.innerText = "Failed to add hostel. Check console for details.";
    }

  });

});
