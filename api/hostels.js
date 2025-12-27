const { connectDB } = require("../lib/db");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

// Disable body parser for Vercel
const config = { api: { bodyParser: false } };

const handler = async (req, res) => {
  try {
    const db = await connectDB();
    const hostels = db.collection("hostels");

    if (req.method === "GET") {
      const data = await hostels.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
      form.maxFileSize = 3 * 1024 * 1024; // 3MB

      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ error: err.message });

        const { name, location, price, category, description } = fields;

        if (!name || !location || !price || !category || !description) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const imageFiles = [files.image1, files.image2, files.image3].filter(Boolean);
        const images = [];

        for (let i = 0; i < imageFiles.length; i++) {
          const file = Array.isArray(imageFiles[i]) ? imageFiles[i][0] : imageFiles[i];
          if (!file) continue;

          if (file.size > 3 * 1024 * 1024)
            return res.status(400).json({ error: `Image ${i + 1} exceeds 3MB.` });

          const tempPath = file.filepath || file.path;
          const fileName = Date.now() + "-" + file.originalFilename;
          const tmpPath = path.join("/tmp", fileName);
          fs.copyFileSync(tempPath, tmpPath);

          images.push(`/tmp/${fileName}`);
        }

        const result = await hostels.insertOne({
          name,
          location,
          price,
          category,
          description,
          images,
          createdAt: new Date()
        });

        return res.status(201).json({ id: result.insertedId });
      });

      return;
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = handler;
module.exports.config = config;
