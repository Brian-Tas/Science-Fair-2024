// Import network class
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork");

// Import tasks for testing
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks")

const { toNetwork } = require("./Storage/toNetwork");

const networks = [];

for(let i = 1; i < 4; i++) {
    networks.push(toNetwork(`./Networks/Test/Network${i}.json`));
}

console.log(networks[0].innovations);
console.log(networks[0].genome.weights);
console.log(networks[0].order);

console.log(networks[1].run(0, 1));