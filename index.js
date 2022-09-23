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
async function run(){
    try{
        await client.connect();
        const productCollection = client.db('fruits').collection('product');
        app.get('/product',async(req,res)=>{
            const query = {};
            const cursor = productCollection.find(query);
            const products= await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        })
        
        
    }
    finally{

    }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('server running');
});


app.listen(port, ()=>{
    console.log('Lisenting a port', port);
});

// fruitsdb
// mPYr28NdU4GhOiwM