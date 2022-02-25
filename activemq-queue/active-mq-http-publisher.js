
const express = require('express')
const app = express()
const hostname = '127.0.0.1';
const port = 3000;
var publisher = require('./publisher');

app.use(express.json())

app.post('/send', (req,res) => {
    var message = req.body.message
    var queue = req.body.queue
    publisher.sendMessage(message,queue)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Message send');
})

app.post('/subscribe', (req,res) => {
  var queue = req.body.queue
  subscriber.init(queue);
  res.statusCode = 200; 
    res.setHeader('Content-Type', 'text/plain');
    res.end('Subscriber added');
})

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  publisher.init()
})

