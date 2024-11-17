// Import network class
const { NeuralNetwork } = require("../NeuralNetwork/NeuralNetwork");

// Import tasks for testing
const { getAnswers, swap, XOR, AND, XOR3 } = require("../Tasks")

// Import networks
const network1JSON = require("./Networks/Network1.json");
const network2JSON = require("./Networks/Network2.json");
const network3JSON = require("./Networks/Network3.json");

console.table(network1JSON);

const network1 = new NeuralNetwork(network1JSON.genome, network1JSON.innovTable);
const network2 = new NeuralNetwork(network2JSON.genome, network2JSON.innovTable);
const network3 = new NeuralNetwork(network3JSON.genome, network3JSON.innovTable);

console.table(getAnswers(network1, XOR));