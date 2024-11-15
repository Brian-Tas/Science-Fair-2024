// Settings
//Tasks
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork.js");
const { getFitness, swap, XOR, AND, XOR3 } = require("./Tasks.js");

// Only here for testing
const { Genome } = require("./NeuralNetwork/Genome.js");
const { Innovation } = require("./NeuralNetwork/Innovation.js");

const InnovationTable =[];
const defaultGenome = new Genome ([[1, 2], [3, 4, 5], [6, 7]], [1, 0.5, -1, -0.2, 0.7, -0.9, 0.2, 1, -0.4], [0, 3, 4, 5, 6, 7, 9, 10, 11]);

InnovationTable.push(
  /*
    sensors = [0, 1]
    hidden = [2, 3, 4]
    outputs = [5, 6]
  */
  /*
    0, 3, 4, 5, 6, 7, 9

    [6, 7, 9],
    [5, 4, 3, 0]

    [9, 7, 6],
    4, 2, 2
    [1, 0, 1, ]
  */
  new Innovation(0, 6), // 0
  new Innovation(0, 7), // 1
  new Innovation(1, 3), // 2
  new Innovation(1, 4), // 3
  new Innovation(1, 5), // 4
  new Innovation(2, 3), // 5
  new Innovation(2, 4), // 6
  new Innovation(2, 5), // 7
  new Innovation(3, 6), // 8
  new Innovation(3, 7), // 9
  new Innovation(4, 7), // 10
  new Innovation(4, 6), // 11
  new Innovation(5, 7), // 12
  new Innovation(1, 5)  // 14
);

const neuralNetwork = new NeuralNetwork(defaultGenome, InnovationTable);

console.table(getFitness(neuralNetwork,XOR));

