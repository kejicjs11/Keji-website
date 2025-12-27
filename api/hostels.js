import { connectDB } from "../lib/db";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
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

        if (!name || !location || !price || !category || !description) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        // Prepare images array safely
        const imageFiles = [files.image1, files.image2, files.image3].filter(Boolean);
        const images = [];

        for (let i = 0; i < imageFiles.length; i++) {
          const file = Array.isArray(imageFiles[i]) ? imageFiles[i][0] : imageFiles[i];
          if (!file) continue;

          // Ensure file <= 3MB
          if (file.size > 3 * 1024 * 1024) {
            return res.status(400).json({ error: `Image ${i + 1} exceeds 3MB limit.` });
          }

          // Save temporarily in /tmp (Vercel writable)
          const tempPath = file.filepath || file.path;
          const fileName = Date.now() + "-" + file.originalFilename;
          const tmpPath = path.join("/tmp", fileName);
          fs.copyFileSync(tempPath, tmpPath);

          // For now, store relative path
          images.push(`/tmp/${fileName}`);
        }

        // Insert into DB
        const result = await hostels.insertOne({
          name,
          location,
          price,
          category,
          images, // can be empty array if no images
          description,
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
      }
