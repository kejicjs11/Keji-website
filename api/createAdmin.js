const bcrypt = require("bcryptjs");
const { connectDB } = require("../lib/db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const passwordHash = await bcrypt.hash("YourPassword123", 10);

    const result = await users.insertOne({
      name: "Keji",
      email: "kejicjs11@gmail.com",
      password: passwordHash,
      role: "admin"
    });

    res.status(201).json({ message: "Admin created", id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
