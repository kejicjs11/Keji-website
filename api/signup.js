import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role)
    return res.status(400).json({ error: "All fields required" });

  if (!["user", "agent"].includes(role))
    return res.status(400).json({ error: "Invalid role" });

  await dbConnect();

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ error: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role
  });

  res.status(201).json({
    message: "Signup successful",
    user: {
      id: user._id,
      name: user.name,
      role: user.role
    }
  });
         }
