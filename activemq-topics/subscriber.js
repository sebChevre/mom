'use strict';
require('dotenv').config();

var Stomp = require('stomp-client');
const port = process.env.ACTIVEMQ_STOMP_PORT
const host = process.env.ACTIVEMQ_STOMP_HOST
const user = process.env.ACTIVEMQ_STOMP_USER
const pass = process.env.ACTIVEMQ_STOMP_PASS

module.exports.init = function init(topicToSubscribe){
    var stompClient = new Stomp(host, port, user, pass);
    
    console.log(`[SUBSCRIBER] >> Subscriber listenning [${host}:${port}] on topic: ${topicToSubscribe}`)

    stompClient.connect(function(sessionId){
        stompClient.subscribe('/topic/' + topicToSubscribe, function(body, headers){
          console.log(`[SUBSCRIBER] >> Message received [topic:${topicToSubscribe}] - ${body}`)
        })
      });
  };