const settings = require("./Storage/Settings.json");
const { mutate } = require("./Mutate");
const { getAnswers, swap, XOR, AND, XOR3 } = require("./Tasks");


// Import innovation
const { Innovation } = require("./NeuralNetwork/Innovation");
const { NeuralNetwork } = require("./NeuralNetwork/NeuralNetwork");
const { totalmem } = require("os");

function avg(arr) {
    let sum = 0;
    const length = arr.length;

    for(let i = 0; i < length; i++) {
        sum += arr[i];
    }

    return sum / length;
}

function MSE(answers, networkAnswers) {
    const subtraction = answers.map((value, index) => Math.tanh(value) - networkAnswers[index]);
    const squared = subtraction.map(value => value ** 2);
    const average = avg(squared);

    return average;
}

class Species {
    static checkSpeciesCount(pop) {
        return Math.max(Math.floor(4 * Math.log(0.4 * pop + 1)), 1);
    }

    static innovUnion(innovations1, innovations2) {
        const finalUnion = [...innovations1];

        for(let i = 0; i < innovations2.length; i++) {
            if(!finalUnion.includes(innovations2[i])) {
                finalUnion.push(innovations2[i]);
            }
        }

        finalUnion.sort((a,b) => a-b);

        return finalUnion;
    }

    static threshold = settings.speciation.threshhold;
    static target = settings.speciation.targetSpecies;
    static missRefactor = settings.speciation.missRefactorConst;
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
                neurons: [[...this.defaultGenome.neurons[0]], [...this.defaultGenome.neurons[1]], [...this.defaultGenome.neurons[2]]],
                innovs: [[...this.defaultGenome.innovs[0]], [...this.defaultGenome.innovs[1]]]
            });
        }

        this.avgFitness = null;
        this.speciesFitness = [];
        this.genomeFitnesses = [];
        this.generation = 0;

        this.networks = new Array(this.size);
        
        this.species = [Array.from({length: this.size}, (_, index) => index)];

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

        for(let i = 0; i < this.genomes.length; i++) {
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
        if((index > this.genomes.length - 1) || (index < 0)) {
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

        similarity = ((c1 * excess) + (c2 * disjoint)) / (Math.max(length1, length2)) + (c3 * average)


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
        this.species = [];
        const marked = new Array(this.genomes.length).fill(false); // [false, false, false...]

        benchmarkLoop:
        for(let h = 0 ; h < this.genomes.length; h++) {
            if(marked[h]) {
                continue benchmarkLoop;
            }

            this.species.push( [ h ] );
            marked[h] = true;

            compareLoop:
            for(let i = 0; i < this.genomes.length; i++) {
                if(marked[i]) {
                    continue compareLoop;
                }

                if(this.compare(h, i) < Species.threshold) {
                    this.species[this.species.length - 1].push(i);
                    marked[i] = true;
                }
            }
        }
    }

    getFitness(index) {
        let fitness = 0;
        const rawArray = [];

        for(let i = 0; i < this.gate.table.length; i++) {
            const answer = this.run(index, this.gate.table[i][0]);

            rawArray.push(1 - MSE(this.gate.table[i][1], answer));
        }

        fitness = avg(rawArray);

        this.genomeFitnesses[index] = fitness;
    }

    getAllFitnesses() {
        for(let i = 0; i < this.genomes.length; i++) {
            this.getFitness(i);
        }
    }

    updateAverageFitness() {
        this.getAllFitnesses();
        this.avgFitness = avg(this.genomeFitnesses);
    }

    logSpecies() {
        for(let i = 0; i < this.species.length; i++) {
            const table = [];

            for(let j = 0; j < this.species[i].length; j++) {
                table.push(this.genomes[this.species[i][j]].innovs[0]);
            }

            console.table(table);
        }
    }

    evolve() {
        this.speciate();
        this.getAllFitnesses();

        const speciesFitness = [];
        const newGenomes = [];

        for(let i = 0; i < this.species.length; i++){
            let sum = 0;

            for(let  h = 0; h < this.species[i].length; h++) {
                sum += this.genomeFitnesses[this.species[i][h]];
            }
    
            speciesFitness.push(
                sum / this.species[i].length
            );
        }

        const totalFitness = speciesFitness.reduce((accumulator, currentValue) => accumulator + currentValue, 0); // sums all fitnesses into one value
        const newSpeciesSizes = [];

        for(let i = 0; i < speciesFitness.length; i++) {
            const preportion = speciesFitness[i] / totalFitness;
            const newSpeciesSize = Math.round(this.size * preportion);

            newSpeciesSizes.push(newSpeciesSize);
        }

        if(newSpeciesSizes.length !== this.species.length) {
            throw new Error(`New species sizes arent matched to the species at evolve. New species: ${newSpeciesSizes} Species: ${this.species}`);
        }

        for(let j = 0; j < this.species.length; j++) {
            const targetSize = newSpeciesSizes[j];
            const species = this.species[j];

            const fitnesses = [];

            for(let i = 0; i < species.length; i++) {
                fitnesses.push(this.genomeFitnesses[species[i]]);
            }
            
            const preportions = fitnesses.map(num => num / (speciesFitness[j] * this.species[j].length));

            const cumulativePreportions = [];
            preportions.reduce((sum, value) => {
                cumulativePreportions.push(sum + value);
                return sum + value;
            }, 0);

            for(let i = 0; i < targetSize; i++) {
                const random1 = Math.random();
                const random2 = Math.random();
    
                const parent1 = this.species[j][cumulativePreportions.findIndex(c => random1 < c)];
                const parent2 = this.species[j][cumulativePreportions.findIndex(c => random2 < c)];

                newGenomes.push(
                    this.crossover(parent1, parent2)
                );
            }
        }

        this.genomes = newGenomes;

        for(let i = 0; i < this.genomes.length; i++) {
            this.mutate(i);
        }

        this.generation++;
    }

    crossover(index1, index2) {
        const genome1 = this.genomes[index1];
        const genome2 = this.genomes[index2];

        this.getFitness(index1);
        this.getFitness(index2);

        const fitness1 = this.genomeFitnesses[index1];
        const fitness2 = this.genomeFitnesses[index2];

        let newGenome = {
            innovs: [
                [],
                []
            ],
            
            neurons: [

            ]
        }

        let [sensors, hiddens, outputs] = [[], [], []];
        
        sensors = [...this.defaultGenome.neurons[0]]; // Sets genome sensors to default genome
        hiddens = [...new Set([...genome1.neurons[1], ...genome2.neurons[1]])] // Makes array of hiddens from both genomes without duplicates
        outputs = [...this.defaultGenome.neurons[2]]; // Sets newGenome outputs to default genome

        newGenome.neurons = [sensors, hiddens, outputs];

        const combined = Species.innovUnion(genome1.innovs[0], genome2.innovs[0]);

        const newInnovs = [];
        const newWeights = [];

        for(let i = 0; i < combined.length; i++) {
            const inG1 = genome1.innovs[0].includes(combined[i]);
            const inG2 = genome2.innovs[0].includes(combined[i]);

            newInnovs.push(combined[i]);

            let innovIndex = -1;

            if(inG1 && inG2) {
                let ratio = null;

                if(fitness1 === 0 && fitness2 === 0) {
                    ratio = 0.5;
                } else {
                    ratio = fitness1 / (fitness1 + fitness2);
                }

                if(Math.random() < ratio) {
                    // Parent 1's weight is chosen
                    innovIndex = genome1.innovs[0].indexOf(combined[i]);
                    newWeights.push(genome1.innovs[1][innovIndex]);
                } else {
                    // parent 2 weight is chosen
                    innovIndex = genome2.innovs[0].indexOf(combined[i])
                    newWeights.push(genome2.innovs[1][innovIndex]);
                }
                
            } else if(inG1) {
                innovIndex = genome1.innovs[0].indexOf(combined[i]);
                newWeights.push(genome1.innovs[1][innovIndex]);
            } else if(inG2) {
                innovIndex = genome2.innovs[0].indexOf(combined[i]);
                newWeights.push(genome2.innovs[1][innovIndex]);
            } else {
                throw new Error(`Combined contains innovation that is not in any of the crossover parents. Genome1.innovs[0]: ${genome1.innovs[0]} Genome2.innovs[0]: ${genome2.innovs[0]} Combined: ${combined}`);
            }
        }

        newGenome.innovs = [ newInnovs, newWeights ];

        return newGenome;
    }



    static gates = new Map([
        ['xor', XOR],
        ['xor3', XOR3],
        ['and', AND],
        ['swap', swap]
    ]);
}

module.exports = { Population }