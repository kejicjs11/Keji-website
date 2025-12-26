const { connectDB } = require("../lib/db");

module.exports = async (req, res) => {
  try {
    const db = await connectDB();
    const hostels = db.collection("hostels");

    if (req.method === "GET") {
      const data = await hostels.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { name, location, price } = req.body;

      if (!name || !location || !price) {
        return res.status(400).json({ error: "Missing fields" });
      }

      await hostels.insertOne({
        name,
        location,
        price,
        createdAt: new Date()
      });

      return res.status(201).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
