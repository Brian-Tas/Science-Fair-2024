const { Innovation } = require("./NeuralNetwork/Innovation");
const { Population } = require("./Population");

const settings = require("./Storage/Settings.json");

settings.startingInnovationTable.forEach(innovation => Innovation.newInnovation(innovation));
settings.startingNeurons.forEach(neuron => Innovation.addNeuron(neuron));
const size = settings.population;

/*
    Valid gates-
    xor, xor3, and, swap

    Path is just file name- i.e.
    Test21, Blank21

    Population args -> path, size, gate
*/




const population = new Population("Blank21", size, 'and');
population.updateAverageFitness();

const startingAvgFitness = population.avgFitness;

function updateConsole() {
    process.stdout.write(`\x1b[0;0H`); 
    process.stdout.write(`\x1b[2J`); 
    
    // Write the updated values
    process.stdout.write(`Average Fitness: ${population.avgFitness}\n`);
    process.stdout.write(`Iteration: ${population.generation}\n`);
    process.stdout.write(`Species: ${population.species.length}`)
    
    
}

for(let i = 0; i < population.size; i++) {
    for(let j = 0; j < 10; j++) {
        population.mutate(i);
    }
}

for(let i = 0; i < 100; i++) {
    population.evolve();
    population.updateAverageFitness();
    updateConsole();

    if(i === 99) {
        debugger;
    }
}

process.stdout.write(`\n`);

process.stdout.write(`\n`);
process.stdout.write(`Fitness Change: ${population.avgFitness - startingAvgFitness}`);


process.stdout.write(`\n`);

console.log(population.species);
population.render(1);
population.logSpecies();