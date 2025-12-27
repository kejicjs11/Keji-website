const { connectDB } = require("../lib/db");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

// Disable default body parser for Vercel
export const config = {
  api: { bodyParser: false }
};

module.exports = async (req, res) => {
  try {
    const db = await connectDB();
    const hostels = db.collection("hostels");

    if (req.method === "GET") {
      const data = await hostels.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
      form.maxFileSize = 3 * 1024 * 1024; // 3MB per file

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({ error: "Error parsing form data: " + err.message });
        }

        const { name, location, price, category, description } = fields;
        const { image1, image2, image3 } = files;

        if (!name || !location || !price || !category || !description || !image1 || !image2 || !image3) {
          return res.status(400).json({ error: "All fields and 3 images are required" });
        }

        // Save images to /public/uploads (Vercel allows /tmp for temporary storage)
        const uploadImage = (file) => {
          const tempPath = file.filepath || file.path;
          const fileName = Date.now() + "-" + file.originalFilename;
          const uploadDir = path.join(process.cwd(), "public", "uploads");
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          const newPath = path.join(uploadDir, fileName);
          fs.copyFileSync(tempPath, newPath);
          return "/uploads/" + fileName;
        };

        const images = [
          uploadImage(image1),
          uploadImage(image2),
          uploadImage(image3)
        ];

        // Insert hostel into DB
        const result = await hostels.insertOne({
          name,
          location,
          price,
          category,
          images,       // array of image URLs
          description,
          createdAt: new Date()
        });

        return res.status(201).json({ id: result.insertedId });
      });

      return; // exit POST
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
