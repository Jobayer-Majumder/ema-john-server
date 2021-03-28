const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://emaJohnAuthor:Hj8OT2Ta6qcGGkJE@jobayer.eggfq.mongodb.net/emaJohnDb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("emaJohnDb").collection("products");
    const orderCollection = client.db("emaJohnDb").collection("orders");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productCollection.insertMany(products)
            .then(result => console.log(result))
    });

    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.get('/product/:key', (req, res) => {
        productCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        });
    });

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productCollection.find({key: { $in : productKeys}})
        .toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.post('/addOrder', (req, res) => {
        const orderDetails = req.body;
        orderCollection.insertOne(orderDetails)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

});



app.get('/', (req, res) => {
    res.send('hello world look im using node.js')
})



app.listen( process.env.PORT || 5000, () => console.log('listening port 5000'))