const { Innovation } = require("./NeuralNetwork/Innovation");
const settings = require("./Storage/Settings.json");

const { Population } = require("./Population");

/*
    Valid gates:
    xor, xor3, and, swap

    Path is just file name- i.e.
    Test21, Blank21
*/

const population = new Population("Test21", 1, 'xor');

console.log(population.networks[0].run(1, 1))
console.log(population.networks[0].render())

// population.networks[0].mutate();