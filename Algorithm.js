// Settings
const { defaults, settings } = require("./Storage/Setup.js");

// Tasks
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork.js");
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks.js");

// NeuralNetwork components
const { Genome } = require("./NeuralNetwork/Genome.js");
const { Innovation } = require("./NeuralNetwork/Innovation.js");


const neuralNetwork = new NeuralNetwork(defaults.genome, defaults.innovationTable);

console.table(getAnswers(neuralNetwork, XOR));

console.table(defaults.innovationTable);