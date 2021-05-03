const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')

const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(port);
