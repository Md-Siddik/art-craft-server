const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mmuv9dp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const artCollection = client.db('artDB').collection('artAndCraft');
    const categoryCollection = client.db('artDB').collection('artCategory');

    app.get('/artCraft', async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // Category get
    app.get('/artCategory', async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/artCategory/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await categoryCollection.findOne(query);
      res.send(result);
    })

    app.post('/artCraft', async (req, res) => {
      const newArtCraft = req.body;
      console.log(newArtCraft);
      const result = await artCollection.insertOne(newArtCraft);
      res.send(result);
    })

    app.get("/artCraft/:email", async(req, res) => {
      console.log(req.params.email);
      const result = await artCollection.find({email:req.params.email}).toArray();
      res.send(result);
    })

    app.put('/artCraft/update/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedItem = req.body;
      const item = {
        $set: {
          image: updatedItem.image,
          item_name: updatedItem.item_name,
          subcategory_Name: updatedItem.subcategory_Name,
          stockStatus: updatedItem.stockStatus,
          price: updatedItem.price,
          email: updatedItem.email,
          name: updatedItem.name,
          rating: updatedItem.rating,
          customization: updatedItem.customization,
          processing_time: updatedItem.processing_time,
          description: updatedItem.description
        }
      }
      
      const result = await artCollection.updateOne(filter, item, options);
      res.send(result);
    })

    app.delete('/artCraft/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await artCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/artCraft/update/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await artCollection.findOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Nature art server is running')
})

app.listen(port, () => {
  console.log(`Nature art server is running on port: ${port}`)
})