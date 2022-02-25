
const express = require('express')
const app = express()
const hostname = '127.0.0.1';
const port = 3000;
var publisher = require('./publisher');
var subscriber = require('./subscriber')

app.use(express.json())

app.post('/send', (req,res) => {
    var message = req.body.message
    var topic = req.body.topic
    publisher.sendMessage(message,topic)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Message send');
})


app.post('/subscribe', (req,res) => {
  var topic = req.body.topic
  subscriber.init(topic);
  res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Subscriber added');
})

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  publisher.init()
})

subscriber.init("test");
subscriber.init("test");
subscriber.init("test-3");
subscriber.init("test-2");
