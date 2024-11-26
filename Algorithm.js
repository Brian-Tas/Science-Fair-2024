// Import settings- i.e. chances/population/other
const settings = require("./Storage/Settings.json");

// Import operations- i.e. crossover/mutation
const { mutate } = require("./Operations/Mutate");

//const { crossover } = require("./Operations/Crossover");

// Import network creator to make networks
const { toNetwork } = require("./Storage/toNetwork");

// Import logic gates + testing
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks");

// Import innovation
const { Innovation } = require("./NeuralNetwork/Innovation");

settings.startingInnovationTable.forEach(innovation => Innovation.newInnovation(innovation));

/*
    !! Code Below !!
           |
           v
*/

const testNetwork = toNetwork("./Networks/Test21.json");
let neuronLayers = [];

testNetwork.neurons = testNetwork.neurons.toString();
testNetwork.neurons = testNetwork.connectors.toString();
testNetwork.innovationTable = testNetwork.innovationTable.toString();

testNetwork.neurons = eval(testNetwork.neurons);
testNetwork.connectors = eval(testNetwork.connectors);
testNetwork.innovationTable = eval(testNetwork.innovationTable);

//const jsonnet = JSON.stringify(testNetwork);

/*const fs = require("fs");

fs.writeFile("./networkJSON", jsonnet, 'utf-16le', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});*/