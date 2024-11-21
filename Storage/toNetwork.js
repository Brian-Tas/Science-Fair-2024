const { NeuralNetwork } = require("../NeuralNetwork/NeuralNetwork");


const toNetwork = (path, innovationTable) => {
    const JSONnetwork = require(path);
    
    const { Genome } = require("../NeuralNetwork/Genome.js");
    const { Innovation } = require("../NeuralNetwork/Innovation.js");

    if(innovationTable === undefined && JSONnetwork.innovationTable === undefined) {
        console.error("No innovation table passed to toNetwork()");
        throw new Error("Issue above")
    }   
    
    let innovTable = [];
    
    if(innovationTable !== undefined) {
        innovTable = innovationTable;
    } else {
        for(let i = 0; i < JSONnetwork.innovationTable.length; i++) {
            innovTable.push(
                new Innovation(...JSONnetwork.innovationTable[i])
            );
        }
    }

    const genome = new Genome(
        JSONnetwork.genome.neurons, 
        JSONnetwork.genome.weights, 
        JSONnetwork.genome.ids
    );

    return new NeuralNetwork(genome, innovTable);
}

module.exports = { toNetwork }