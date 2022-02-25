'use strict';
require('dotenv').config();

var Stomp = require('stomp-client');
const port = process.env.ACTIVEMQ_STOMP_PORT
const host = process.env.ACTIVEMQ_STOMP_HOST
const user = process.env.ACTIVEMQ_STOMP_USER
const pass = process.env.ACTIVEMQ_STOMP_PASS
var stompClient;

stompClient = new Stomp(host, port, user, pass);


console.log(`[SUBSCRIBER] >> Subscriber listenning [${host}:${port}] on queue: ${queueToSubscribe}`)

stompClient.connect(function(sessionId){
    stompClient.subscribe('/queue/' + queueToSubscribe, function(body, headers){
      console.log(`[SUBSCRIBER] >> Message received [queue:${queueToSubscribe}] - ${body}`)
    })

  });
  

