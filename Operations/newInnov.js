const { Innovation } = require("../NeuralNetwork/Innovation");

const innov = connection => {
    neurons = connection.split("-");
    
    [neurons[0], neurons[1]] = [parseInt(neurons[0]), parseInt(neurons[1])]
    
    console.log(neurons);
}

module.exports = { innov }