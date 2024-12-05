// Import settings- i.e. chances/population/other
const settings = require("./Storage/Settings.json");

// Import operations- i.e. crossover/mutation
const { mutate } = require("./Operations/Mutate");

//const { crossover } = require("./Operations/Crossover");

// Import network creator to make networks
const { toNetwork } = require("./Storage/toNetwork");

// Import logic gates + testing
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks");

// Import innovation
const { Innovation } = require("./NeuralNetwork/Innovation");

settings.startingInnovationTable.forEach(innovation => Innovation.newInnovation(innovation));

/*
    !! Code Below !!
           |
           v
*/

const testNetwork = toNetwork("./Networks/Test21.json");

console.log(testNetwork.run(1, 1));
console.log(testNetwork.genome)