//My configuration file to start Kafka, Mongodb and features of my model. 

const config = {

	"kafkaConfig":{

		KafkaHost:'localhost:9092',
	    KafkaTopic1: 'StockMarketAnalysis',
	    KafkaTopic2: 'StockMarketPredictions',
	},

    "dbConfig":{
    	user: 'Put your user information of the your Mongodb Atlas Account',
	    password: 'Password for the account',
	    server: 'clustera1.cvglu.mongodb.net/',
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