const { connectDB } = require("../lib/db");

module.exports = async function handler(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("hostels");

    if (req.method === "GET") {
      const hostels = await collection.find({}).toArray();
      return res.status(200).json(hostels);
    }

    if (req.method === "POST") {
      const { name, location, price, description } = req.body;

      if (!name || !location || !price) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const hostel = {
        name,
        location,
        price,
        description: description || "",
        createdAt: new Date(),
      };

      await collection.insertOne(hostel);

      return res.status(201).json(hostel);
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
