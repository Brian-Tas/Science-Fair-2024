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
*/

const population = new Population("Test21", 10, 'xor');

population.model(0);
console.log(population.networks[0].genome);
for(let i = 0; i < 20; i++) {
    population.mutate(0);
}
population.model(0);
console.log(population.networks[0].genome);