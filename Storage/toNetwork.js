const { NeuralNetwork } = require("../NeuralNetwork/NeuralNetwork");


const toNetwork = (network) => {
    if(typeof network === 'string') {
        const JSONnetwork = require(network);
    } else if (typeof network === 'object') {
        const JSONnetwork = network;
    } else {
        throw new Error(`Network passed to toNetwork is not a path or genome. Type: ${typeof network}`);
    }
    
    const { Genome } = require("../NeuralNetwork/Genome.js");
    const { Innovation } = require("../NeuralNetwork/Innovation.js");

    

    const genome = new Genome(
        JSONnetwork.neurons, 
        JSONnetwork.weights, 
        JSONnetwork.ids,
        JSONnetwork.order,
        JSONnetwork.layers
    );

    return new NeuralNetwork(genome, Innovation.innovationTable);
}

module.exports = { toNetwork }