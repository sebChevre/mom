'use strict';
require('dotenv').config();

var amqp = require('amqplib/callback_api');
const port = process.env.ACTIVEMQ_STOMP_PORT
const host = process.env.ACTIVEMQ_STOMP_HOST
const user = process.env.ACTIVEMQ_STOMP_USER
const pass = process.env.ACTIVEMQ_STOMP_PASS

var MessageProducer = function MessageProducer(){
  this.channel = null;
};

MessageProducer.prototype.init = function init(){
  var that = this;
  amqp.connect('amqp://user:password@localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        that.channel = channel
       // var queue = 'hello';
       // var msg = 'Hello World!';

        
        //channel.sendToQueue(queue, Buffer.from(msg));

        //console.log(" [x] Sent %s", msg);
    });
    
});
};

MessageProducer.prototype.sendMessage = function sendMessage(messageToPublish, queueToPublish){
  try{
    this.channel.assertQueue(queueToPublish, {
      durable: false
  });
    this.channel.sendToQueue(queueToPublish, Buffer.from(messageToPublish));
     console.log(`[PUBLISHER] >> Message published on queue : ${queueToPublish}, message: ${messageToPublish}]`);
  }catch (e) {
    console.log(e)
  }
};

module.exports = new MessageProducer();