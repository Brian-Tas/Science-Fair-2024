const settings = require("./Storage/Settings.json");
const { mutate } = require("./Operations/Mutate");
const { toNetwork } = require("./Storage/toNetwork");
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks");

// Import innovation
const { Innovation } = require("./NeuralNetwork/Innovation");
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork");

settings.startingInnovationTable.forEach(innovation => Innovation.newInnovation(innovation));


class Population {
    constructor(path, size, gate) {
        this.path = path;
        this.size = size;
        this.gate = Population.gates.get(gate);;

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
        for(let i = 0; i < size; i++) {
            this.genomes.push();
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