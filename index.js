const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const clientsQueue = [];
const clientQueueLength = 5;

app.get('/', (req, res) => {
    let response;
    if(!clientsQueue.length) {
        response = {
            message: 'Client queue is empty',
        };
        return res.status(200).json(response)
    }

    const client = clientsQueue.shift();
    response = { message: 'Done', client };
    return res.status(200).json(response);
});

app.post('/', (req, res) => {
    const data = req.body;
    let response;

    if(clientsQueue.length >= clientQueueLength) {
        response = {
            message: 'The queue is full, please be patient. Thank you'
        };
        return res.status(200).json(response);
    }

    if(clientsQueue.length === 0) {
        data.pk = 1;
    } else {
        data.pk = clientsQueue[clientsQueue.length - 1].pk + 1;
    }
    clientsQueue.push(data);

    response = { message: 'Done', client: data };
    return res.status(201).json(response);
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
