'use strict';
require('dotenv').config();
var Stomp = require('stomp-client');

function ActiveMqQueueSubScriber(queueName){
  const port = process.env.ACTIVEMQ_STOMP_PORT
  const host = process.env.ACTIVEMQ_STOMP_HOST
  const user = process.env.ACTIVEMQ_STOMP_USER
  const pass = process.env.ACTIVEMQ_STOMP_PASS

  console.log(pass)
  this.client = new Stomp(host, port, user, pass);
  this.queueName = queueName

  console.log(`[SUBSCRIBER] >> Subscriber listenning [${host}:${port}] on queue: ${queueName}`)

  var that = this;
  this.client.connect(function(sessionId){
    that.client.subscribe('/queue/' + queueName, function(body, headers){
        console.log(`[SUBSCRIBER] >> Message received [queue:${queueName}] - ${body}`)
      })

    });

  this.unsubscribe = function () {
    that.client.unsubscribe(queueName)
  }

}

module.exports = { ActiveMqQueueSubScriber : ActiveMqQueueSubScriber}