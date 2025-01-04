const { Innovation } = require("./NeuralNetwork/Innovation");
const { Population } = require("./Population");

const settings = require("./Storage/Settings.json");

settings.startingInnovationTable.forEach(innovation => Innovation.newInnovation(innovation));
settings.startingNeurons.forEach(neuron => Innovation.addNeuron(neuron));
const size = settings.population;

/*
    Valid gates-
    xor, xor3, and, swap

    Path is just file name- i.e.
    Test21, Blank21

    Population args -> path, size, gate
*/



const population = new Population("Test21", size, 'xor');


for(let i = 0; i < population.size; i++) {
    for(let j = 0; j < 2; j++) {
        population.mutate(i);
    }
}
population.crossover(1, 2);
population.evolve();

