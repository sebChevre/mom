'use strict';
require('dotenv').config();

var Stomp = require('stomp-client');

const port = process.env.ACTIVEMQ_STOMP_PORT
const host = process.env.ACTIVEMQ_STOMP_HOST
const user = process.env.ACTIVEMQ_STOMP_USER
const pass = process.env.ACTIVEMQ_STOMP_PASS
var stompClient;

stompClient = new Stomp(host, port, user, pass);

const args = process.argv;
console.log(args[2]);

var query = require('cli-interact').question;

var queueToSubscribe = args[2]

if(queueToSubscribe === undefined) {
  console.log("You have to pass the queue name as function argument")
  console.log("Ex: node active-mq-subscriber.js test")
  var answer = query('Tap enter to quit...');
  process.exit(1)
}

console.log(`[SUBSCRIBER] >> Subscriber listenning [${host}:${port}] on topic: ${queueToSubscribe}`)

stompClient.connect(function(sessionId){
    stompClient.subscribe('/topic/' + queueToSubscribe, function(body, headers){
      console.log(`[SUBSCRIBER] >> Message received [topic:${queueToSubscribe}] - ${body}`)
    })

  });
  