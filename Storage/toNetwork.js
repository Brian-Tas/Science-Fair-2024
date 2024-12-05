const { NeuralNetwork } = require("../NeuralNetwork/NeuralNetwork");


const toNetwork = (path) => {
    const JSONnetwork = require(path);
    
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