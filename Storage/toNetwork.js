
const toNetwork = path => {
    const JSONnetwork = require(path);
    
    const { Genome } = require("../NeuralNetwork/Genome.js");
    const { Innovation } = require("../NeuralNetwork/Innovation.js");
    
    const innovationTable = [];
    
    for(let i = 0; i < JSONnetwork.innovationTable.length; i++) {
        innovationTable.push(
            new Innovation(...JSONnetwork.innovationTable[i])
        );
    }
    
    const genome = new Genome(
        JSONnetwork.genome.neurons, 
        JSONnetwork.genome.weights, 
        JSONnetwork.genome.ids
    );
    
    
    const network = {
        genome: genome,
        innovationTable: innovationTable
    }

    return network;
}

module.exports = { toNetwork }