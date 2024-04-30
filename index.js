const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p3ukwfo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const itemCollection = client.db("artAndCraftDB").collection("items");
    const newItemCollection = client.db("artAndCraftDB").collection("newItems");

    app.get('/items', async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const item = await itemCollection.findOne(query);
      res.send(item);
    })

    app.get('/items-email/:email', async (req, res) => {
      const result = await itemCollection.find({ email: req.params.email }).toArray();
      console.log(result);
      res.send(result);
    })

    app.post('/items', async (req, res) => {
      const addItem = req.body;
      console.log(addItem);
      const result = await itemCollection.insertOne(addItem);
      res.send(result);
    })

    app.delete('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/items/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedItem =req.body;
      const item = {
        $set:{
          item_name: updatedItem.item_name, 
          description: updatedItem.description, 
          subcategory_name: updatedItem.subcategory_name, 
          customization: updatedItem.customization, 
          rating: updatedItem.rating, 
          stockStatus: updatedItem.stockStatus, 
          price: updatedItem.price, 
          processing_time: updatedItem.processing_time, 
          image: updatedItem.image
        }
      }
      const result = await itemCollection.updateOne(filter, item, options);
      res.send(result);
    })

    // newItems section CRUD operation

    app.get('/newItems', async (req, res) => {
      const cursor = newItemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/newItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const newItem = await newItemCollection.findOne(query);
      res.send(newItem);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('ART & CRAFT SERVER IS RUNNING')
})
app.listen(port, () => {
  console.log(`Art and Craft server is running on port: ${port}`)
})