let body = req.body;

if (!body) {
  try {
    body = JSON.parse(req.body);
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
}

const { email, password } = body;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookie = require("cookie");
const { connectDB } = require("../lib/db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
      })
    );

    return res.status(200).json({ message: "Login successful" });

  } catch (err) {
    console.error("LOGIN CRASH:", err);
    return res.status(500).json({ error: err.message });
  }
};
