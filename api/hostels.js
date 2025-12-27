const { connectDB } = require("../lib/db");
const { ObjectId } = require("mongodb");

// Example middleware to get current user from session/JWT
async function getCurrentUser(req) {
  // Replace this with your auth logic
  // e.g., decode JWT or session
  return { id: "user123", role: "admin" }; // demo user
}

module.exports = async (req, res) => {
  try {
    const db = await connectDB();
    const hostels = db.collection("hostels");
    const currentUser = await getCurrentUser(req);

    if (req.method === "GET") {
      const data = await hostels.find({}).toArray();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { name, location, price, category, description, images, ownerId } = req.body;
      if (!name || !location || !price || !category || !description || !images || !ownerId) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const result = await hostels.insertOne({
        name, location, price, category, description, images,
        ownerId, status: "available",
        createdAt: new Date()
      });

      return res.status(201).json({ id: result.insertedId });
    }

    if (req.method === "DELETE") {
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "Missing ID" });

      await hostels.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    if (req.method === "PATCH") {
      const { id, action } = req.body;
      if (!currentUser) return res.status(403).json({ error: "Unauthorized" });
      if (!id || !action) return res.status(400).json({ error: "Missing data" });

      if (action === "markTaken") {
        const hostel = await hostels.findOne({ _id: new ObjectId(id) });
        if (!hostel) return res.status(404).json({ error: "Hostel not found" });

        if (hostel.ownerId !== currentUser.id && currentUser.role !== "admin") {
          return res.status(403).json({ error: "Forbidden" });
        }

        await hostels.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "taken" } }
        );

        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: "Invalid action" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
