/**
 * Description.
 * Developing model Architecture.
 * Compiling and fitting the model with training data.
 * Save and Load model.
**/

//Importing package for tensorflow.js
const tf = require('@tensorflow/tfjs-node');

//Calling the  file which is in the repository (Our own package)
//1.kafkaConfig
//2.dbConfig
//3.trainConfig
const config = require('./config');

//Pulling the train.config file for model configurations.
const configTrain = config.trainConfig;

//************************************************************************************************** */

//MODEL BUILDING PROCESS:

//1. Building the model architecture.
/**
 * create tfjs model architecture.
 * @param {tensor} input_ - input tensor.
 * @return {tensor} model - Model architecture.
**/
function createModel(input_){

	const model = tf.sequential();

	model.add(tf.layers.reshape({inputShape:[input_[0].length], 
		                        targetShape: [input_[0].length, 1]}));
	model.add(tf.layers.lstm({units: 50, returnSequences: true}));
	model.add(tf.layers.dropout(0.20));

	model.add(tf.layers.lstm({units: 50, returnSequences: true}));
	model.add(tf.layers.dropout(0.25));

	model.add(tf.layers.lstm({units: 50, returnSequences: true}));
	model.add(tf.layers.dropout(0.20));

	model.add(tf.layers.lstm({units: 50}));
	model.add(tf.layers.dropout(0.25));

    model.add(tf.layers.dense({units: 1}));

    return model;
}
//************************************************************************************************** */

//2. Computing the loss and error at the end of every batch. 
/*
 * @param {integer} batch - batch number.
 * @param {dict} logs - computed loss and error estimated by loss functions.
**/
function onBatchEnd(batch, logs) {
  console.log({"loss":logs.loss, "mse": logs.mse, "mae": logs.mae});
}
//************************************************************************************************* */

//3. Saving the model weights.
/**
 * @param {tensor} model - trained model.
**/
async function saveModel(model){
    
	const savedModel = await model.save('file://'+ configTrain.modelDir);
	console.log("Model weights saved.");
}

//************************************************************************************************ */

//4. Training the model.
/**
 *@param {tensor} model - tfjs model to be trained.
 *@param {Array} X - model input.
 *@param {Array} y - target to prediction.
**/
async function train(model, X, y){
	// prepare the model for training
	model.compile({
				    optimizer: tf.train.adam(),
				    loss: 'meanSquaredError',
				    metrics: ['mse','mae'],
				});

    // train model
    await model.fit(
            	tf.tensor(X),
            	tf.tensor(y),
            	{
            		epochs: configTrain.epoch,
				    batchSize: configTrain.batchSize,
				    callbacks: {onBatchEnd}

            	}
        );
    // save model
    saveModel(model);
}

//************************************************************************************************ */

//5. Load Model weight and predict output.
/**
 * @param {Array} test_data - input data for model to predict.
 * @return {Array} - Predicted output.
**/
async function processModel(test_data){
	const model =  await tf.loadLayersModel('file://'+configTrain.modelDir+'/model.json');
	               
	return model.predict(tf.tensor(test_data))
}
module.exports = { createModel, onBatchEnd, train, saveModel, processModel}

//*********************************************************************************************** */