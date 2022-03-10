'use strict';
require('dotenv').config();

var amqp = require('amqplib/callback_api');
const port = process.env.RABBITMQ_PORT
const host = process.env.RABBITMQ_HOST
const user = process.env.RABBITMQ_USER
const pass = process.env.RABBITMQ_PASS

//RabbitMQ Config
const exchange = "test.exchange"
const queueBinded = "test.bind.queue"
const exchangeType ="direct"
const durable = true

var rabbitMqConnextionString = `amqp://${user}:${pass}@${host}:${port}`;

amqp.connect(rabbitMqConnextionString, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        //Direct bind, queue et exchange douivent être créés
        channel.bindQueue(queueBinded, exchange, 'test.route');
        channel.bindQueue("test.bind.queue.2", exchange, 'test.route2');
        channel.bindQueue("test.bind.queue.3", exchange, 'test.route2');

        console.log(`[PUBLISHER] >> AMQP client connected [${rabbitMqConnextionString}]`);

        console.log("[PUBLISHER] >> inserting 10 messages")

        channel.assertExchange(exchange,exchangeType, {
            durable: durable
        });

        for (let it = 0; it < 10; it++) {
            var message = Buffer.from(`Message ${it}`)
            channel.publish(exchange,'test.route2',message,{persistent: true} );
            console.log(`[PUBLISHER] >> Message published on exchange : ${exchange}, message: ${message}]`);
        }
    });

});