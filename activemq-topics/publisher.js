'use strict';
require('dotenv').config();

var Stomp = require("stomp-client");
const port = process.env.ACTIVEMQ_STOMP_PORT
const host = process.env.ACTIVEMQ_STOMP_HOST
const user = process.env.ACTIVEMQ_STOMP_USER
const pass = process.env.ACTIVEMQ_STOMP_PASS

var MessageProducer = function MessageProducer(){
  this._stompClient = null;
};

MessageProducer.prototype.init = function init(){
  this._stompClient = new Stomp(host, port, user, pass);
  
  this._stompClient.connect(function(sessionId){
    console.log(`[PUBLISHER] >> STOMP client connected [${host}:${port}]`);
  });
};

MessageProducer.prototype.sendMessage = function sendMessage(messageToPublish, topicToPublish){
  try{
    this._stompClient.publish('/topic/' + topicToPublish, messageToPublish);
    console.log(`[PUBLISHER] >> Message published on topic : ${topicToPublish}, message: ${messageToPublish}]`);
  }catch (e) {
    console.log(e)
  }
};

module.exports = new MessageProducer();

