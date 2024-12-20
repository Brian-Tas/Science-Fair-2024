const { Innovation } = require("./NeuralNetwork/Innovation");
const { mutate } = require("./Operations/Mutate");
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
    
for(let i = 0; i < 10; i++) {
    population.mutate(i);
    population.model(i)
    console.log(population.networks[i].run(1, 0));
}