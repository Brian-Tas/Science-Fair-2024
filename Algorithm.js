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


const networks = [];
const innovationTable = new Map();

const newInnovation = arr => {
    const innovation = new Innovation(arr[0], arr[1]);

    innovationTable.set(`${arr[0]}-${arr[1]}`, innovation);
    innovationTable.set(innovation.id, innovation);
}

settings.startingInnovationTable.forEach(innov => newInnovation(innov));


for(let i = 0; i < settings.population; i++) {
    networks.push(toNetwork("./Networks/Blank21.json", innovationTable));
}

console.log(networks);
