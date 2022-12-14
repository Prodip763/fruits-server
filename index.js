const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.berdtuh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('fruits').collection('product');
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        //quantity
        app.put('/product/update/:id', async (req, res) => {
            const id = req.params.id;
            const item = req.body.item;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            if (item.action === 'inc') {
                const increase = item.amount + 1;
                const data = {

                    $set: {
                      amount: increase
                    }
                  }
                  const result = await productCollection.updateOne(filter, data, options);
                  const message= `data added successfully`
                  return res.send({result, message});
            }
            else if(item.action === 'dec' && item.amount > 0){
                
                const decrese = item.amount -1;
                const data = {

                    $set: {
                      amount: decrese
                    }
                  }
                  const result = await productCollection.updateOne(filter, data, options);
                  const message= `data decrease successfully`
                  return res.send({result, message});
            }

        });

        //add item
        app.post('/product', async(req, res)=>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        //update item
        
        app.put('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    balance: updatedUser.balance,
                    about: updatedUser.about,
                    picture: updatedUser.picture,
                    supplierName: updatedUser.supplierName,
                    amount: updatedUser.amount,
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // my item

        // app.get("/product/:email", async (req, res) => {
        //     const email = req.params.email;
        //     const filter = { email: email };
        //     const cursor = productCollection.find(filter);
        //     const fruits = await cursor.toArray();
        //     res.send(fruits);
        //   });

        //delete
        app.delete('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });


    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server running');
});


app.listen(port, () => {
    console.log('Lisenting a port', port);
});
