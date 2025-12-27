const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

async function createAdmin() {
  const client = await MongoClient.connect("YOUR_MONGO_URI");
  const db = client.db("abrakahomes");
  const users = db.collection("users");

  const hashedPassword = await bcrypt.hash("YourPassword123", 10);

  await users.insertOne({
    name: "kejicjs11",
    email: "kejicjs11@gmail.com",
    password: hashedPassword,
    role: "admin",
    createdAt: new Date()
  });

  console.log("Admin user created!");
  client.close();
}

createAdmin();
