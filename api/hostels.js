const { connectDB } = require("../lib/db");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  try {
    const db = await connectDB();
    const hostels = db.collection("hostels");

    if (req.method === "GET") {
      const data = await hostels.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { name, location, price, category, description, images } = req.body;
      if (!name || !location || !price || !category || !description || !images) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const result = await hostels.insertOne({
        name, location, price, category, description, images,
        createdAt: new Date()
      });

      return res.status(201).json({ id: result.insertedId });
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "Missing ID" });

      await hostels.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
