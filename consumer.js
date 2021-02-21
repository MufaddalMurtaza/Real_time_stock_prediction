/**
 * Description.
 * Consumer - consumer of the Kafka Stream.
 * Consume messages from the stream and update them to MongoDB.
**/

//npm package for kafka
const kafka = require('kafka-node');

//Calling the config file which is in the repository (Our own package)
//1.kafkaConfig
//2.dbConfig
//3.trainConfig
const config = require('./config');

//Calling the  file which is in the repository (Our own package)
//1.kafkaConfig
//2.dbConfig
//3.trainConfig
const db = require('./InstantiateDB');

//Creating the kafkaConfig object from the config file which was imported
//This has the kakfa server host ip and port which is the local machine. 
//It also has the kafka topics
const configKafka = config.kafkaConfig;

//Instantiating the consumer object to const Producer from the Kafka module which was imported
const Consumer = kafka.Consumer;

//Creating an object for a new client/server and then giving the ip and port address from the configKafka
//object which was created.
//This object directly connects to the kafka brokers.
//idleConnection : Allows the broker to disconnect an idle connection from a client 
//				   (otherwise the clients continues to O after being disconnected).(in ms)
//					We have give a day's time for being idle. 
const client = new kafka.KafkaClient({idleConnection: 24 * 60 * 60 * 1000,  kafkaHost: configKafka.KafkaHost});

//Setting up the consumer object.
let consumer = new Consumer(
	client,
	[{topic: configKafka.KafkaTopic1, partition: 0 }],
    {
    	autoCommit: true,
    	fetchMaxWaitMs: 1000,
    	fetchMaxBytes: 1024 * 1024,
    	encoding: 'utf8',
    }
	);

//Updates the Mongodb collections.
consumer.on('message', async function(message){
    // Storing or updating consumed stream messages to MongoDB.
	db.updateMongoDB(message)
});
consumer.on('error', function(error) {
    //  handle error 
    console.log('error', error);
});