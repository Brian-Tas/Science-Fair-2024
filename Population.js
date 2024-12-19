const settings = require("./Storage/Settings.json");
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks");
const { mutate } = require("./Operations/Mutate");

// Import innovation
const { Innovation } = require("./NeuralNetwork/Innovation");
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork");



class Population {
    constructor(path, size, gate) {
        this.size = size;
        this.gate = Population.gates.get(gate);

        const JSONgenome = require(`./Storage/Networks/${path}.json`);
        this.genomes = Array(size).fill(JSONgenome);

        // Error handling in the case args arent the correct datatype
        if(typeof path !== 'string') {
            throw new Error(`Path is not a string. Path: ${path} Type: ${typeof path}`)
        }

        if(typeof this.size !== 'number') {
            throw new Error(`Population size isn't a number. Size: ${this.size} Type: ${typeof this.size}`)
        }

        if(typeof this.gate !== 'function') {
            throw new Error(`Passed gate is not a valid gate. Gate: ${this.gate} \nValid Gates: ${Array.from(Population.gates.keys())}`);
        }

        this.networks = []; // Is updated with .network() from the genome array
        this.updateNetworks();
    }

    getAnswers() {
        for(let i = 0; i < networks.length; i++) {
            console.table(getAnswers(this.networks[i], this.gate));
        }
    }

    updateNetworks() {
        for(let i = 0; i < this.genomes.length; i++) {
            this.networks.push(
                new NeuralNetwork(this.genomes[i])
            );
        }
    }

    mutate(id) {
        const network = this.networks[id];

        if(typeof network === undefined) {
            throw new Error(`Network with id of ${id} does not exist. Cannot mutate`);
        }

        mutate(network);
        this.genomes[id] = network.genome;
    }

    model(id) {
        this.networks[id].render();
    }

    static gates = new Map([
        ['xor', XOR],
        ['xor3', XOR3],
        ['and', AND],
        ['swap', swap]
    ]);
}

module.exports = { Population }