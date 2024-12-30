const settings = require("./Storage/Settings.json");
const { mutate } = require("./Operations/Mutate");
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks");


// Import innovation
const { Innovation } = require("./NeuralNetwork/Innovation");
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork");

function avg(arr) {
    let sum = 0;
    const length = arr.length;

    for(let i = 0; i < length; i++) {
        sum += arr[i];
    }

    return sum / length;
}

class Species {
    static checkSpeciesCount(pop) {
        return Math.max(Math.floor(4 * Math.log(0.4 * pop + 1)), 1);
    }
}

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
            this.genomes.push({
                neurons: [...this.defaultGenome.neurons],
                innovs: [[...this.defaultGenome.innovs[0]], [...this.defaultGenome.innovs[1]]]
            });
        }

        this.networks = new Array(this.size);
        
        this.species = [Array.from({length: this.size}, (_, index) => index)];

        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < 3; j++) {
                this.mutate(i);
            }
        }
        this.speciate();
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

    compare(i1, i2) {
        const genome1 = [[...this.genomes[i1].innovs[0]], [...this.genomes[i1].innovs[1]]];
        const genome2 = [[...this.genomes[i2].innovs[0]], [...this.genomes[i2].innovs[1]]];

        const length1 = genome1[0].length;
        const length2 = genome2[0].length;
        
        const minLength = Math.min(length1, length2);
        
        let matching = [];
        let disjoint = 0;
        let excess = 0;
        
        const marked1 = new Array(length1).fill(false);
        const marked2 = new Array(length2).fill(false);

        // Calculate matching
        for(let i = 0; i < minLength; i++) {
            if(marked1[i] || marked2[i]) {
                continue;
            }

            if(genome1[0][i] === genome2[0][i]) {
                matching.push(i);
                marked1[i] = true;
                marked2[i] = true;
            }
        }

        // Calculate disjoint
        for(let i = 0; i < length1; i++) {
            if(marked1[i]) {
                continue;
            }

            for(let j = 0; j < length2; j++) {
                if(marked2[j]) {
                    continue;
                }

                if(genome1[0][i] === genome2[0][j]) {
                    disjoint++;
                    marked1[i] = true;
                    marked2[j] = true;
                }
            }
        }

        // Calculate excess
        for(let i = 0; i < length1; i++) {
            if(marked1[i]) {
                continue;
            }

            excess++;
        }

        for(let i = 0; i < length2; i++) {
            if(marked2[i]) {
                continue;
            }

            excess++;
        }

        let average = 0;

        if(matching.length > 0) {
            for(let i = 0; i < matching.length; i++) {
                average += Math.abs(genome1[1][matching[i]] - genome2[1][matching[i]]);
            }

            average /= matching.length;
        }


        const [c1, c2, c3] = Object.values(settings.compare);

        let similarity = 0;

        similarity = ((c1 * excess) + (c2 * disjoint)) / (length1 + length2) + (c3 * average)


        return similarity;
    }

    mutate(index) {
        this.updateNetwork(index);
        
        mutate(this.networks[index]);

        this.genomes[index] = this.networks[index].genome;

        this.check(index);
    }

    render(index) {
        try {
            this.check(index);
        } catch (err) {
            this.updateNetwork(index);
        }
        
        this.networks[index].render();
    }

    speciate() {
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.species.length; j++) {
                const speciesCheckCount = Species.checkSpeciesCount(this.species[j].length);
                const tempSpecies = [...this.species[j]];

                const comparasins = [];

                for(let i = 0; i < speciesCheckCount; i++) {
                    const randomInt= Math.floor(Math.random() * tempSpecies.length);
                    const chosenComparer = tempSpecies[randomInt];

                    tempSpecies.splice(randomInt, 1);

                    comparasins.push(
                        this.compare(i, chosenComparer)
                    );
                }

                const avgCompare = avg(comparasins);

                console.log(avgCompare);
            }
        }
    }

    evolve() {
        // Sort genomes into species
    }

    static gates = new Map([
        ['xor', XOR],
        ['xor3', XOR3],
        ['and', AND],
        ['swap', swap]
    ]);
}

module.exports = { Population }