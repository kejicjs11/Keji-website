
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://kejicjs11:<keji4265>@cluster0.8cdujmv.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


const { connectDB } = require("../lib/db");

module.exports = async function handler(req, res) {
  console.log("Function invoked");
  try {
    const db = await connectDB();
    console.log("DB connected");
    const collection = db.collection("hostels");

    if (req.method === "GET") {
      const hostels = await collection.find({}).toArray();
      console.log("Hostels fetched:", hostels.length);
      return res.status(200).json(hostels);
    }

    if (req.method === "POST") {
      const { name, location, price, description } = req.body;
      if (!name || !location || !price)
        return res.status(400).json({ message: "Missing fields" });

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
    console.error("Error caught:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
