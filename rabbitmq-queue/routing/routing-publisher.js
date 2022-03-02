'use strict';
require('dotenv').config();

var amqp = require('amqplib/callback_api');
const port = process.env.RABBITMQ_PORT
const host = process.env.RABBITMQ_HOST
const user = process.env.RABBITMQ_USER
const pass = process.env.RABBITMQ_PASS

var MessageProducer = function MessageProducer(){
  this.channel = null;
};

MessageProducer.prototype.init = function init(){
  var that = this;
  var rabbitMqConnextionString = `amqp://${user}:${pass}@${host}:${port}`;

  amqp.connect(rabbitMqConnextionString, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        
        that.channel = channel
        console.log(`[PUBLISHER] >> AMQP client connected [${rabbitMqConnextionString}]`);
    });
    
});
};

MessageProducer.prototype.sendMessage = function sendMessage(messageToPublish, exchangeToPublish, eventToPublish){
  try{
      var t = this.channel.assertExchange(exchangeToPublish,'direct', {
        durable: false
    });

    this.channel.publish(exchangeToPublish,eventToPublish, Buffer.from(messageToPublish));
    console.log(`[PUBLISHER] >> Message published on exchange : ${exchangeToPublish}, message: ${messageToPublish}, event: ${eventToPublish}]`);
  
  }catch (e) {
    console.log(e)
  }
};

module.exports = new MessageProducer();