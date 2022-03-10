'use strict';
require('dotenv').config();

const minimist = require('minimist')
const amqp = require('amqplib/callback_api');

const port = process.env.RABBITMQ_PORT
const host = process.env.RABBITMQ_HOST
const user = process.env.RABBITMQ_USER
const pass = process.env.RABBITMQ_PASS
const vhost = process.env.RABBITMQ_VHOST

var exchange, delay, nbMessage, routingKey

var rabbitMqConnextionString = `amqp://${user}:${pass}@${host}:${port}/${vhost}`;

parseArgs()

console.log(`Launching process with params: exchange: ${exchange}, nbMessage: ${nbMessage}, delay: ${delay}`)
console.log(`Connecting to rabbitmq instances: ${rabbitMqConnextionString}`)
amqp.connect(rabbitMqConnextionString, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        console.log(`[PRODUCER] >> AMQP client connected [${rabbitMqConnextionString}]`);

        console.log(`[PRODUCER] >> inserting ${nbMessage} messages each ${delay} seconds on exchange(s) : ${exchange}`)

        startMessageLoop(channel)
    });

});

function startMessageLoop (channel) {
    var loopCount = 0
  
    var loopInterval = setInterval(function timer() {
        var message = {}
        message.date = new Date().toISOString()
        message.message = "Hello from producer"
        message.iteration = loopCount

        var msg = Buffer.from(JSON.stringify(message))
        channel.publish(exchange,routingKey,msg,{persistent: true} );
        console.log(`[PRODUCER] >> Message published on exchange : ${exchange}, message: ${msg}, routingKey: ${routingKey}`);
        loopCount ++
      
        if(loopCount == nbMessage){
            clearInterval(loopInterval)
        }
    }, delay * 1000);
}

function parseArgs () {
    const args = process.argv.slice(2)  
    const parsedArgs = minimist(args) 
    var paramsError = false;

    if (parsedArgs.exchange === undefined)    {
        console.log("[Error] you must provie at least one exchange to publish message. Param --exchange")
        paramsError = true
    }
    if (parsedArgs.routingKey === undefined)    {
        console.log("[Error] you must provie at least one routingKey to publish message. Param --routingKey")
        paramsError = true
    }
    if (parsedArgs.nbMessage === undefined)    {
        console.log("[Error] you must provide the number of message to publish. Param --nbMessage")
        paramsError = true
    }
    if (parsedArgs.delay === undefined)    {
        console.log("[Error] you must provide the delay of publishing messages. Param --delay")
        paramsError = true
    }

    if(paramsError){
        displayScriptUsage ()
        process.exit(1)
    }

    exchange = parsedArgs.exchange
    nbMessage = parsedArgs.nbMessage
    delay = parsedArgs.delay
    routingKey = parsedArgs.routingKey
}

function displayScriptUsage () {
    console.log("**********************************************************************************************")
    console.log("Script to generate message to a or any rabbitmq queue")
    console.log("Usage: node StandardQueueProducer.js --exchange=test.q --nbMessage=10 --delay=1 --routingKey=toto")
    console.log("Mean: send 10 message to queue test.q with a delay of 1 seconds bettween each message")
    console.log("Script will exit now")
    console.log("**********************************************************************************************")
}