const express = require('express')
const app = express()
const hostname = '127.0.0.1';
const port = 3000;
var publisher = require('./queue-publisher');

app.use(express.json())

app.post('/send', (req,res) => {
    var message = req.body.message
    var queue = req.body.queue
    publisher.sendMessage(`${new Date().toISOString()} - ${message}`,queue)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Message send');
})

app.post('/send/:nb_messages/each/:seconds', (req,res) => {
  var messages = req.body.messages
  var queue = req.body.queue

  var iteration = req.params.nb_messages
  var delay = req.params.seconds

  console.log(`Number of iteration:${iteration}, each:${delay} seconds`)
 
  
  startMessageLoop(messages,queue, delay, iteration)

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Process started');
})

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  publisher.init()
})

function startMessageLoop (messages, queue, delay, iteration) {
  var loopCount = 0
  var nbreOfRandomMessages = messages.length
  
  loopInterval = setInterval(function timer() {
    
    var msgIndex = getRandomMessagesIndex(nbreOfRandomMessages)
    
    publisher.sendMessage(`${new Date().toISOString()} - ${messages[msgIndex]}`,queue)
    loopCount ++
    
    if(loopCount == iteration){
      clearInterval(loopInterval)
    }
  }, delay * 1000);
}

function getRandomMessagesIndex (nbreOfRandomMessages) {
    return Math.floor(Math.random() * nbreOfRandomMessages) 
}



