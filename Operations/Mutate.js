const settings = require("../Storage/Settings.json");

const mutate = (genome, innovationTable) => {
    if(genome.order === null) {
        throw new Error("Genome must have an order when mutated");
    } 
}

module.exports = { mutate }