// Import network class
const { NeuralNetwork } = require("../NeuralNetwork/NeuralNetwork");

// Import tasks for testing
const { getAnswers, swap, XOR, AND, XOR3 } = require("../Tasks")

const { toNetwork } = require("../Storage/toNetwork");

const networks = [];

for(let i = 1; i < 4; i++) {
    const netObj = toNetwork(`../Test/Networks/Network${i}.json`);
    console.table(netObj)

    networks.push(
        new NeuralNetwork(netObj.genome, netObj.innovationTable)
    );
}

console.table(networks[0].run(1, 1));