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
    publisher.sendMessage(`${new Date().toISOString()} - ${message}`,exchange)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Message send');
})

app.post('/send/:nb_messages/each/:seconds', (req,res) => {
  var message = req.body.message
  var exchange = req.body.exchange

  var iteration = req.params.nb_messages
  var delay = req.params.seconds

  console.log(`Number of iteration:${iteration}, each:${delay} seconds`)
 
  
  startMessageLoop(message,exchange, delay, iteration)

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Process started');
})

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  publisher.init()
})

function startMessageLoop (message, exchange, delay, iteration) {
  var loopCount = 0

  loopInterval = setInterval(function timer() {
    publisher.sendMessage(`${new Date().toISOString()} - ${message}`,exchange)
    loopCount ++
    
    if(loopCount == iteration){
      clearInterval(loopInterval)
    }
  }, delay * 1000);
}



