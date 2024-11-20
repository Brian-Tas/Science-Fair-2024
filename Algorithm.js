// Import settings i.e. chances/population/other
const settings = require("./Storage/Settings.json");

// Import operations- i.e. crossover/mutation

// Import network creator to make networks
const { toNetwork } = require("./Storage/toNetwork");

const networks = [];

for(let i = 0; i < settings.population; i++) {
    networks.push(toNetwork("./Networks/Blank21.json"));
}

console.table(networks.length)