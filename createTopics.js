
//npm package for kafka
const kafka = require('kafka-node');

//Calling the config file which is in the repository (Our own package)
//1.kafkaConfig
//2.dbConfig
//3.trainConfig
const config = require('./config');

//Creating an object for a new client/server and then giving the ip and port address from the configKafka
//object which was created.
//This object directly connects to the kafka brokers.
const client = new kafka.KafkaClient({kafkaHost: config.KafkaHost});

//Topic configs
const topicToCreate = [{
	topic: config.KafkaTopic1,
	partitions: 1,
	replicationFactor: 3,
},
{
	topic: config.KafkaTopic2,
	partitions: 1,
	replicationFactor: 3,
}
]

//Creates the topics and if any errors returns them as an array
client.createTopics(topicToCreate, (error, result) => {
	console.log(result, 'topic created successfully');
})