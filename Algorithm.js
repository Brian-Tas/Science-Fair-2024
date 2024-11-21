// Import settings- i.e. chances/population/other
const settings = require("./Storage/Settings.json");

// Import operations- i.e. crossover/mutation
const { toGenomes } = require("./Operations/toGenomes");
const { mutate } = require("./Operations/Mutate");
const { innov } = require("./Operations/newInnov");

//const { crossover } = require("./Operations/Crossover");

// Import network creator to make networks
const { toNetwork } = require("./Storage/toNetwork");

// Import logic gates + testing
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks");



const networks = [];
const innovationTable = [];

for(let i = 0; i < settings.population; i++) {
    networks.push(toNetwork("./Networks/Blank21.json"));
}

console.table(networks[0].neurons)

innov("1-2");