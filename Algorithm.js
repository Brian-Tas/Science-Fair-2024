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


const size = 1000//settings.population;

const population = new Population("Test21", size, 'xor');

population.speciate();

for(let i = 0; i < size; i++) {
    for(let j = 0; j < 2; j++) {
        population.mutate(i);
    }
}

population.speciate();

population.logSpecies();
console.log(population.species);