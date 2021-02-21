/**
 * Description.
 * Connect to MongoDB Client.
 * Do basic CRUD operations with MongoDB.
**/

//Calling the config file which is in the repository (Our own package)
//1.kafkaConfig
//2.dbConfig
//3.trainConfig
const config = require('./config');

//Importing the mongodb.MongoClient
const MongoClient = require('mongodb').MongoClient;

//Calling DB configuration
const configDB = config.dbConfig;

// "dbConfig":{
//     user: "Enter-your-Mongodb-Atlas-username",
//     password: "Enter-your-Mongodb-Atlas-account-password",
//     server: 'Add-your-server-name',
//     database: 'StockLogsDB',
//     collectionStream: 'StockData',
//     collectionML: 'mlPrediction',
// }

// Database configuration.
// Creating the url for the Mongodb-Atlas connection from the dbConfig file.
const uri = "mongodb+srv://"
            + configDB.user + ":"
            + configDB.password + "@"
            + configDB.server
            + configDB.database
            + "?retryWrites=true&w=majority";

//Note: If the above url does not connect, then comment the uri const and uncomment the 
//      following line and add your url connection manually. Make sure the database and collection
//      names are the same as that given in the config file.

//const uri = "Your-Mongodb-Server-url"

/**
 * Update MongoDB with incomming logs.
 * @param {JSON} message - Incomming messages to be updated to DB.
 * @param {String} collectionInterface - Connect to specific collection of the DB.
 * @param {Boolean} stream - If incomming messages are from a kafka stream or not.
**/

async function updateMongoDB(message, collectionInterface = configDB.collectionStream, stream=true){
    
    if (stream == true){
        console.log(
            'kafka ',
            JSON.parse(message.value)
        );
        var logs_ = JSON.parse(message.value)
    } else {
        console.log(
            'Ml_Prediction ',
            message
        );
        logs_ = message
    }

    //Creating a client object to connect to Mongodb 
    let client = await MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
    
    //Connecting and adding records to the database
    client.connect(err => {
    if (err) throw err;
    const collection = client.db(configDB.database).collection(collectionInterface);
    collection.insertOne(logs_, function(err, res) {
        if (err) throw err;
        console.log("documents inserted." + res.insertedCount);
    });
    });
    client.close();
}
/**
 * Get information about the Database collection.
 * @return {integer} size of the database collection.
 * @return {JSON} return first three logs of the database collection.
**/
async function getDBInfo(){
    
    let client = await MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
    
    client.connect(err => {
    if (err) throw err;
    const collection = client.db(configDB.database).collection(configDB.collectionStream);
    
    //Finds the collection and displays the first three objects in the database
    collection.find({},{ projection: { _id: 0, Date: 1, Open: 1, High: 1, Low: 1, Close:1, Volume:1 } 
        }).toArray(function(err, result) {
            if (err) throw err;
            console.log("Size of DB: "+result.length);
            console.log("First three objects of the Array: ");
            console.log(result.slice(0,3));
    client.close();
        });
    });
}

module.exports = { updateMongoDB, MongoClient, uri, getDBInfo}
