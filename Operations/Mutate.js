const settings = require("../Storage/Settings.json");
const { Genome } = require("../NeuralNetwork/Genome");

const mutate = genome => {
    const neurons = [];

    genome.forEach(layer => {
        layer.forEach(neuron => {
            neurons.push(neuron);
        });
    });

    // New connections


}

module.exports = { mutate }