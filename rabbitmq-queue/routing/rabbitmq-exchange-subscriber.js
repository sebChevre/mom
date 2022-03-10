'use strict';
require('dotenv').config();

var amqp = require('amqplib/callback_api');
const port = process.env.RABBITMQ_PORT
const host = process.env.RABBITMQ_HOST
const user = process.env.RABBITMQ_USER
const pass = process.env.RABBITMQ_PASS

var rabbitMqConnextionString = `amqp://${user}:${pass}@${host}:${port}`;

var query = require('cli-interact').question;

const args = process.argv;
var exchangeToSubscribe = args[2]
var eventsToSubscribe =  args[3]

if(exchangeToSubscribe === undefined) {
  console.log("You have to pass the queue name as function argument")
  console.log("Ex: node active-mq-subscriber.js test")
  var answer = query('Tap enter to quit...');
  process.exit(1)
}

console.log(`params[event=${eventsToSubscribe}, exchange=${exchangeToSubscribe}]`)

amqp.connect(rabbitMqConnextionString, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    
  
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertExchange(exchangeToSubscribe,"direct", {
            durable: false
        });

        channel.assertQueue('',{
            exclusive: true
        },function (error2, q){
            if (error2) {
                throw error2;
            }
            console.log(`[SUBSCRIBER] >> Subscriber listenning [${host}:${port}] on exchange: ${exchangeToSubscribe}, event: ${eventsToSubscribe}`)
            
            eventsToSubscribe.forEach(function(event){
                console.log(event)
                channel.bindQueue(q.queue, exchangeToSubscribe, event);
            })
            

            channel.consume(q.queue, function(msg) {
                console.log(`[SUBSCRIBER] >> Message received [queue:${q.queue}] - ${msg.content.toString()}`)
            }, {
                noAck: true
            });
        })

        
    });
});