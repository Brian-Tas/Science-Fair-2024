// Settings
const settings = require("./Settings.json");


const { Genome } = require("../NeuralNetwork/Genome.js");
const { Innovation } = require("../NeuralNetwork/Innovation.js");

const innovationTable = [];

for(let i = 0; i < settings.innovationTable.length; i++) {
    innovationTable.push(
        new Innovation(...settings.innovationTable[i])
    );
}

const defaultGenome = new Genome(
    settings.neurons, 
    settings.weights, 
    settings.innovations
);


const defaults = {
    genome: defaultGenome,
    innovationTable: innovationTable
}

module.exports = { defaults, settings }