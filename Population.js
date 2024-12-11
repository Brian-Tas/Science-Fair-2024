const settings = require("./Storage/Settings.json");
const { mutate } = require("./Operations/Mutate");
const { toNetwork } = require("./Storage/toNetwork");
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks");

// Import innovation
const { Innovation } = require("./NeuralNetwork/Innovation");
const { Genome } = require("./NeuralNetwork/Genome");
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork");

settings.startingInnovationTable.forEach(innovation => Innovation.newInnovation(innovation));


class Population {
    constructor(path, size, gate) {
        this.path = path;
        this.size = size;
        this.gate = Population.gates.get(gate);
        this.defaultGenome = require("./Storage/Networks/Blank21.json");

        // Error handling in the case args arent the correct datatype
        if(typeof this.path !== 'string') {
            throw new Error(`Path is not a string. Path: ${path} Type: ${typeof path}`)
        }

        if(typeof this.size !== 'number') {
            throw new Error(`Population size isn't a number. Size: ${this.size} Type: ${typeof this.size}`)
        }

        if(typeof this.gate !== 'function') {
            throw new Error(`Passed gate is not a valid gate. Gate: ${this.gate} \nValid Gates: ${Array.from(Population.gates.keys())}`);
        }

        this.genomes = []; // Array of genome *objects*

        // Fill this.genomes with the default blank
        let g = this.defaultGenome;
        for(let i = 0; i < size; i++) {
            this.genomes.push(new Genome(g.neurons, g.weights, g.ids));
        }
    }

    getAnswers() {
        let networks = [];

        for(let i = 0; i < this.genomes.length; i++) {
            networks.push(
                new NeuralNetwork(this.genomes[i], Innovation.table)
            );
        }

        for(let i = 0; i < networks.length; i++) {
            console.table(getAnswers(networks[i], this.gate));
        }
    }

    static gates = new Map([
        ['xor', XOR],
        ['xor3', XOR3],
        ['and', AND],
        ['swap', swap]
    ]);
}

module.exports = { Population }