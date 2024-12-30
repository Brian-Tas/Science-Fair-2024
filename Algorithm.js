const { Innovation } = require("./NeuralNetwork/Innovation");
const { Population } = require("./Population");

const settings = require("./Storage/Settings.json");

settings.startingInnovationTable.forEach(innovation => Innovation.newInnovation(innovation));
settings.startingNeurons.forEach(neuron => Innovation.addNeuron(neuron));

/*
    Valid gates-
    xor, xor3, and, swap

    Path is just file name- i.e.
    Test21, Blank21

    Population args -> path, size, gate
*/


const population = new Population("Test21", 150, 'xor');

console.log(population.species);

for(let i = 0; i < 150; i++) {
    console.log(population.genomes[i]);
}