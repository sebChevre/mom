'use strict';
require('dotenv').config();

const minimist = require('minimist')
const amqp = require('amqplib/callback_api');
const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'files');


const port = process.env.RABBITMQ_PORT
const host = process.env.RABBITMQ_HOST
const user = process.env.RABBITMQ_USER
const pass = process.env.RABBITMQ_PASS

var exchange, delay, nbMessage, routingKey

var rabbitMqConnextionString = `amqp://${user}:${pass}@${host}:${port}`;

parseArgs()

console.log(`Launching process with params: exchange: ${exchange}, nbMessage: ${nbMessage}, delay: ${delay}`)

amqp.connect(rabbitMqConnextionString, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        console.log(`[PRODUCER] >> AMQP client connected [${rabbitMqConnextionString}]`);

        console.log(`[PRODUCER] >> publishing messages each ${delay} seconds on exchange(s) : ${exchange}, file based`)

        startMessageLoop(channel)
    });

});

function startMessageLoop (channel) {
    
   fs.readdir("files", function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {

            // Do whatever you want to do with the file
            //console.log(file); 
            fs.readFile(directoryPath + '\\' +  file, 'utf8' , (err, data) => {
                if (err) {
                    console.error(err)
                    return
                }

                var msg = Buffer.from(data)
                channel.publish(exchange,routingKey,msg,{persistent: true} );
                console.log(`[PRODUCER] >> File based message published on exchange : ${exchange}, file: ${file}, routingKey: ${routingKey}`);
                
            })            
        });
    });
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
    routingKey = parsedArgs.routingKey
}

function displayScriptUsage () {
    console.log("**********************************************************************************************")
    console.log("Script to generate message to a or any rabbitmq queue")
    console.log("Usage: node StandardQueueProducer.js --queue=test.q")
    console.log("Mean: send 10 message to queue test.q with a delay of 1 seconds bettween each message")
    console.log("Script will exit now")
    console.log("**********************************************************************************************")
}