import { connectDB } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("hostels");

    // GET → fetch all hostels
    if (req.method === "GET") {
      const hostels = await collection.find({}).toArray();
      return res.status(200).json(hostels);
    }

    // POST → add a new hostel
    if (req.method === "POST") {
      const {
        name,
        location,
        price,
        agentId,
        description,
        images,
      } = req.body;

      if (!name || !location || !price) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newHostel = {
        name,
        location,
        price,
        agentId: agentId || null,
        description: description || "",
        images: images || [],
        verified: false,
        createdAt: new Date(),
      };

      await collection.insertOne(newHostel);

      return res.status(201).json({
        message: "Hostel added successfully",
        hostel: newHostel,
      });
    }

    // Method not allowed
    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
        }
