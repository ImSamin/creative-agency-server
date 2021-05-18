const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('services'));
app.use(fileUpload());

const port = 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jdvgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
    res.send('Hello World Samin!');
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const ordersCollection = client.db(`${process.env.DB_Name}`).collection("orders");
    const serviceCollection = client.db(`${process.env.DB_Name}`).collection("services");
    const reviewCollection = client.db(`${process.env.DB_Name}`).collection("review");
    const adminCollection = client.db(`${process.env.DB_Name}`).collection("admin")
    app.post("/addOrders", (req, res) => {
        const orders = req.body;

        ordersCollection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get("/orders", (req, res) => {
            adminCollection.find({email: req.query.email})
            .toArray((err, admin) => {
                
                if(admin.length === 0){
                    ordersCollection.find({ email: req.query.email })
                        .toArray((err, documents) => {
                            res.send(documents);
                        })
                }

                ordersCollection.find({})
                    .toArray((err, documents) => {
                        res.send(documents);
                    })

            })
             
    })

    app.post("/addService", (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        // const filePath = `${__dirname}/service/${file.name}`;
        console.log(title, description, file);


        const newImg = req.files.file.data;
        const encImg = newImg.toString('base64');

        const image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };


        serviceCollection.insertOne({ title, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            });


    })

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body;

        reviewCollection.insertOne(review)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addAdmin', (req, res) => {
        const admin = req.body;

        adminCollection.insertOne(admin)
        .then(result => {
            res.send(result.insertedCount > 0);
        })

    })

    app.post('/isAdmin', (req, res) => {
        adminCollection.find({ email: req.body.email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
    })


});



app.listen(process.env.PORT || port);
