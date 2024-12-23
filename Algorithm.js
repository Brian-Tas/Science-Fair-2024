const { Innovation } = require("./NeuralNetwork/Innovation");
const { mutate } = require("./Operations/Mutate");
const { Population } = require("./Population");
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork");

const settings = require("./Storage/Settings.json");


settings.startingInnovationTable.forEach(innovation => Innovation.newInnovation(innovation));
settings.startingNeurons.forEach(neuron => Innovation.addNeuron(neuron));

/*
    Valid gates-
    xor, xor3, and, swap

    Path is just file name- i.e.
    Test21, Blank21
*/


const network = new NeuralNetwork({
    innovs: [
        [0, 2, 3, 4, 1],
        [1, 1, 1, 1, 1]
    ],
    neurons: [
        [ 1, 2 ],
        [ 3, 4, 5],
        [ 6 ]
    ]
});


for(let i = 0; i < 1500; i++) {
    mutate(network);
    console.log(i);
}