var amqp = require('amqplib/callback_api');


const express = require('express')
const app = express()
const hostname = '127.0.0.1';
const port = 3000;
var publisher = require('./pubsub-publisher');

app.use(express.json())

app.post('/send', (req,res) => {
    var message = req.body.message
    var exchange = req.body.exchange
    publisher.sendMessage(message,exchange)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Message send');
})

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  publisher.init()
})





