console.log("Connecting to MongoDB...");
const client = await clientPromise;
console.log("MongoDB connected!");

const { clientPromise } = require("../../lib/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function getUserFromToken(req) {
  const token = req.cookies?.token;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  const client = await clientPromise;
  const db = client.db("abrakahomes");
  const hostels = db.collection("hostels");

  const user = getUserFromToken(req);

  try {
    switch (req.method) {
      case "GET":
        const all = await hostels.find().toArray();
        return res.status(200).json(all);

      case "POST":
        if (!user) return res.status(401).json({ error: "Not logged in" });
        const hostel = { ...req.body, ownerId: user.id, status: "available" };
        const result = await hostels.insertOne(hostel);
        return res.status(201).json({ id: result.insertedId });

      case "PATCH":
        if (!user) return res.status(401).json({ error: "Not logged in" });
        const { id, action } = req.body;
        if (action === "markTaken") {
          await hostels.updateOne({ _id: new require("mongodb").ObjectId(id), ownerId: user.id }, { $set: { status: "taken" } });
          return res.status(200).json({ message: "Marked taken" });
        }
        return res.status(400).json({ error: "Unknown action" });

      case "DELETE":
        if (!user || user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
        await hostels.deleteOne({ _id: new require("mongodb").ObjectId(req.body.id) });
        return res.status(200).json({ message: "Deleted" });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("HOSTELS ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
