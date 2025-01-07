const { errorMonitor } = require("events");
const { Innovation } = require("./NeuralNetwork/Innovation");
const { Population } = require("./Population");

const settings = require("./Storage/Settings.json");

const fs = require(`fs`);

settings.startingInnovationTable.forEach(innovation => Innovation.newInnovation(innovation));
settings.startingNeurons.forEach(neuron => Innovation.addNeuron(neuron));
const size = settings.population;

/*
    Valid gates-
    xor, xor3, and, swap, same

    Path is just file name- i.e.
    Test21, Blank21, Blank11

    Population args -> path, size, gate
*/


function updateConsole(population, itteration) {
    process.stdout.write(`\x1b[0;0H`); 
    process.stdout.write(`\x1b[2J`); 
    
    // Write the updated values
    process.stdout.write(`Average Fitness: ${population.avgFitness}\n`);
    process.stdout.write(`Iteration: ${population.generation}\n`);
    process.stdout.write(`Species: ${population.species.length}\n`);
    process.stdout.write(`\nTotal Itterations: ${itteration}\n`);
}

const dataArray = [];

for(let j = 0; j < 20; j++) {
    const population = new Population("Blank11", size, 'same');
    population.updateAverageFitness();
    
    for(let i = 0; i < population.size; i++) {
        for(let j = 0; j < 1; j++) {
            population.mutate(i);
        }
    }

    const averageArray = [];
    
    for(let i = 0; i < 125; i++) {
        population.evolve();
        population.updateAverageFitness();
        updateConsole(population, j);

        averageArray.push(population.avgFitness);

        if(population.avgFitness > 0.98) {
            break;
        }
    
        if(i === 99) {
            debugger;
        }
    }

    dataArray.push(averageArray);
}
const JSONdata = JSON.stringify(dataArray, null, 2);

fs.writeFile(`./data.json`, JSONdata, 'utf8', function (err) {
    if (err) {
        throw new Error(err);
    }
});