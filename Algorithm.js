const { Innovation } = require("./NeuralNetwork/Innovation");
const settings = require("./Storage/Settings.json");

const { Population } = require("./Population");

/*
    Valid gates:
    xor, xor3, and, swap

*/

const population = new Population("./Networks/Blank21.json", 10, 'xor');

console.table(population.getAnswers());