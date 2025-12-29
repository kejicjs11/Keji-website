const bcrypt = require("bcryptjs");
const { clientPromise } = require("../../lib/db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const client = await clientPromise;
    const db = client.db("abrakahomes");
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({ name, email, password: hashedPassword, role: "user" });

    res.status(201).json({ message: "User created", id: result.insertedId });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};
