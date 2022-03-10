'use strict';
require ('custom-env').env('k8s')

var amqp = require('amqplib/callback_api');
const port = process.env.RABBITMQ_PORT
const host = process.env.RABBITMQ_HOST
const user = process.env.RABBITMQ_USER
const pass = process.env.RABBITMQ_PASS

var rabbitMqConnextionString = `amqp://${user}:${pass}@${host}:${port}`;

var query = require('cli-interact').question;

const args = process.argv;
var queueToSubscribe = args[2]

if(queueToSubscribe === undefined) {
  console.log("You have to pass the queue name as function argument")
  console.log("Ex: node active-mq-subscriber.js test")
  var answer = query('Tap enter to quit...');
  process.exit(1)
}

amqp.connect(rabbitMqConnextionString, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    console.log(`[SUBSCRIBER] >> Subscriber listenning [${host}:${port}] on queue: ${queueToSubscribe}`)
  
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        /**channel.assertQueue(queueToSubscribe, {
            durable: true, 
            "x-queue-type": "quorum" 

        });*/

        channel.consume(queueToSubscribe, function(msg) {
            console.log(`[SUBSCRIBER] >> Message received [queue:${queueToSubscribe}] - ${msg.content.toString()}`)
        }, {
            noAck: true
        });
    });
});