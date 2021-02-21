//My configuration file to start Kafka, Mongodb and features of my model. 

const config = {

	"kafkaConfig":{
		KafkaHost:'localhost:9092',
	    KafkaTopic1: 'StockMarketAnalysis',
	    KafkaTopic2: 'StockMarketPredictions',
	},
    
	//Make sure to create database and collections withe same name as that given over here.
	"dbConfig":{
    	user: "Enter-your-Mongodb-Atlas-username",
	    password: "Enter-your-Mongodb-Atlas-account-password",
	    server: 'Add-your-server-name',
	    database: 'StockLogsDB',
	    collectionStream: 'StockData',
	    collectionML: 'mlPrediction',
    },
    "trainConfig":{
    	trainSize: 85,
    	epoch: 50,
    	batchSize: 32,
        modelDir: 'models',
    },
    "type": "Open"
};

//Wrapping the info in a module for usage across the project.
module.exports = config;