const settings = require("./Storage/Settings.json");
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks");
const { mutate } = require("./Operations/Mutate");

// Import innovation
const { Innovation } = require("./NeuralNetwork/Innovation");
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork");



class Population {
    constructor(path, size, gate) {
        try {
            this.defaultGenome = require(`./Storage/Networks/${path}.json`);
        } catch(err) {
            throw new Error(`Invalid path at Population. Path (cant end with .json or /): ${path}`);
        }

        this.size = size;

        if(typeof this.size !== 'number') {
            throw new Error(`Size passed to Population is not a number. Size: ${this.size}`);
        }

        this.gate = Population.gates.get(gate);
        
        if(typeof this.gate === 'undefined') {
            throw new Error(`Pass through a valid gate to Population. Gate: ${gate}`);
        }


        this.genomes = [];

        for(let i = 0; i < this.size; i++) {
            this.genomes.push(this.defaultGenome);
        }

        this.networks = new Array(this.size);
    }

    check(index) {
        if(JSON.stringify(this.genomes[index]) !== JSON.stringify(this.networks[index].genome)) {
            throw new Error(`Check failed at population. Genome at i: ${this.genomes[index]} Network Genome at i: ${this.networks[index].genome}`);
        }
    }

    checkAll() {
        if(this.size !== this.networks.length) {
            throw new Error(`Networks array and this.size are desynced at population. Size: ${this.size} networks length: ${this.networks.length}`);
        }

        for(let i = 0; i < this.size; i++) {
            this.check(i);
        }
    }

    updateNetworks() {
        this.networks = [];

        for(let i = 0; i < this.size; i++) {
            this.updateNetwork(i);
        }

        this.checkAll();
    }

    updateNetwork(index) {
        if((index > this.size - 1) || (index < 0)) {
            throw new Error(`Invalid index at updateNetwork. Index: ${index} Size: ${index}`);
        }

        this.networks[index] = new NeuralNetwork(this.genomes[index]);
        this.check(index);
    }

    run(index, inputs) {
        this.updateNetwork(index);

        return this.networks[index].run(...inputs);
    }

    static gates = new Map([
        ['xor', XOR],
        ['xor3', XOR3],
        ['and', AND],
        ['swap', swap]
    ]);
}

module.exports = { Population }