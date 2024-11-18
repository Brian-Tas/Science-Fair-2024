// Import network class
const { NeuralNetwork } = require("../NeuralNetwork/NeuralNetwork");

// Import tasks for testing
const { getAnswers, swap, XOR, AND, XOR3 } = require("../Tasks")

const { toNetwork } = require("../Storage/toNetwork");

const networks = [];

for(let i = 1; i < 4; i++) {
    const netObj = toNetwork(`../Test/Networks/Network${i}.json`);
    networks.push(
        new NeuralNetwork(netObj.genome, netObj.innovationTable)
    );
}

console.log(networks[0].innovations)
console.log(networks[0].genome.weights)
console.log(networks[0].order)

console.log(networks[0].run(1));