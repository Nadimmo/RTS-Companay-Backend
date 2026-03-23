const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "https://rts-companay-backend.vercel.app/"],
  credentials: true
}));
app.use(express.json()); 

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rrkijcq.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect(); 

    const db = client.db("visa-processingDB");
    const userCollection = db.collection("usersInfo");

    // User Info API
    app.post("/userInfo", async (req, res) => {
      try {
        const info = req.body;
        const result = await userCollection.insertOne(info);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to save user info" });
      }
    });

    app.get("/userInfo", async (req, res) => {
     const result = await userCollection.find().toArray();
     res.send(result);
    });

    app.get("/userInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.delete("/userInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    
    
   
    
    await client.db("admin").command({ ping: 1 });
    console.log(" MongoDB Connected Successfully");
  } finally {
    // keep connection alive
  }
}

run().catch(console.dir);

//  Root
app.get("/", (req, res) => {
  res.send("Project is Ready !");
});

// Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});