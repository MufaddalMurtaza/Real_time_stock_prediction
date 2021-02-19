/**
 * Description.
 * Producer - Producer of the Kafka Stream. 
 * Pipeline logs from source to two Topics.
**/

//*************************************************************************************************** */

//1. Getting all the dependecies from the package.json file which were added with the help of npm.

//Package for kafka
const Kafka = require('kafka-node');

//Calling the config file which is in the repository (Our own module)
//1.kafkaConfig
//2.db0Config
//3.trainConfig
const config = require('./config');

//File system package for node.js. 
const fs = require('fs');

//Csv-parser package for node.js. 
const parse = require('csv-parse');

//Async package for node.js.
var async = require('async');

//Path package for node.js
var path = require('path');

//************************************************************************************************** */

//2. Setting up the Kafka server configuration and creating the producer.
//Note: The Config file has the kakfa server host ip and port which is the same as that of the local machine. 
//		It also has the kafka topics

//Configuration info of the kafka server 
const configKafka = config.kafkaConfig;

//Instantiating the producer object to const Producer from the Kafka module which was imported
const Producer = Kafka.Producer;

//Creating an object for a new client/server.
//This object directly connects to the kafka brokers.
const client = new Kafka.KafkaClient({kafkaHost: configKafka.KafkaHost});

//Creating a new object from the Producer. 
var producer = new Producer(client, {requireAcks: 1, partitionerType: 2});

//************************************************************************************************* */

//3.Setting up the messages/data records to be streamed.

//Instantiating to var KeyedMessage from kafka module.
var KeyedMessage = Kafka.KeyedMessage;
var km = new KeyedMessage('key', 'message');

//Creating a path to the Datasets
const parentDir = './Datasets/';

//Parameters for the message reading.
const averageDelay = 3000;  // in miliseconds
const spreadInDelay = 2000; // in miliseconds
var ProducerReady = false ;
var stockArray;

//We switch on the kafka server hosted locally and start accepting messages
//There are two events: Ready and Error to check the status of the Kafka Producer
//Async function is used for operations to run concurrently.
producer.on('ready', async function () {
    console.log("Producer is ready");
    ProducerReady = true;
});

producer.on('error', function (err) {
  console.error("Problem with producing Kafka message "+err);
})
 
//Function to parse the data record coming to the kafka server from the database.
//We do this because data is spaced by commas
var parser = parse({delimiter: ','}, function (err, data){
	//Adding the data record
    stockArray = data;
	//Running this function to format the record in json
    handleStock(1);  
});

// Read data from a data-source.
fs.createReadStream(parentDir.concat('HPQ.csv')).pipe(parser); 

/**
 * Pipeline processed logs into 2 topics.
 *  @param {JSON} data - processed logs.
**/
function stockMarketMessages(data){
	KeyedMessage = Kafka.KeyedMessage;
	KM = new KeyedMessage(data.code, JSON.stringify(data));
    // Pipeline logs into two topics.
	payloadToKafkaTopic = [
        { topic: configKafka.KafkaTopic1, partition: 0, messages: KM },
        { topic: configKafka.KafkaTopic2, partition: 0, messages: KM },
    ];
    if(ProducerReady){
	    producer.send(payloadToKafkaTopic, function (err, data) {
	        console.log(data);
	    });
    } else {
    	console.error("sorry, Producer is not ready yet, failed to produce message to Kafka.");
    }
    
}

/**
 * Read data from a file and sent it for streaming.
 * @param {integer} dataCount - maintains the row count.
**/
function handleStock(dataCount){
	var line = stockArray[dataCount];
	var stock = { "Date":line[0]
		        , "Open":parseFloat(line[1])
		        , "High":parseFloat(line[2])
		        , "Low":parseFloat(line[3])
		        , "Close":parseFloat(line[4])
		        , "Volume":parseFloat(line[6])
		};	
	stockMarketMessages(stock)
	// Adds delay after passing each log to the pipeline.
	var delay = averageDelay + (Math.random() -0.5) * spreadInDelay;
	setTimeout(handleStock.bind(null,dataCount+1), delay);

}

//************************************************************************************************** */
