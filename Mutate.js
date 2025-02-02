const settings = require("./Storage/Settings.json");
const { Innovation } = require("./NeuralNetwork/Innovation");

const mutate = (network, mutationChance = null) => {
    // Get array of new neurons
    let newNeurons = []
    
    for(let i = 0; i < network.connectors.get("length"); i++) {
        if(Math.random() < settings.mutation.odds.newNeuron) {
            const connector = network.connectors.get(i);
            newNeurons.push(
                [connector.from, connector.to]
            );
        }
    }
    
    for(let i = 0; i < newNeurons.length; i++) {
        const innovation = Innovation.ensure([...newNeurons[i], 'neuron']);

        if(innovation === 'undefined') {
            throw new Error(`Innovation.check has failed at newNeuron mutation`)
        }
    
        network.addNeuron(innovation.id);
    }

    // Array for storing all the possible connections between all nodes
    let possibleConnections = [];

    /*
    Layer example-
    [5, 4],      -|
    [6, 7],       | 
    [3],          |
    [8, 2, 1, 0] -| <- 'i' iterates through these;

    'h' iterates through these
    |
    V
    ___________
    |         |
    [8, 2, 1, 0]

    for every 'h' iterable, 'q'-

    [5, 4],             -|
    [6, 7],          A   | <- 'q' iterates through these
    [3],             |  -|
    [8, 2, 1, 0] <-| layers above

    Finally-

    'g' iterates through these
    |
    V
    [6, 7]

    */


    for(let i = 0; i < network.layers.length; i++)
    {
        for(let h = 0; h < network.layers[i].length; h++) 
        {
            for(let q = i + 1; q < network.layers.length; q++) 
            {
                pushLoop:
                for(let g = 0; g < network.layers[q].length; g++) {
                    const from = network.layers[i][h];
                    const to = network.layers[q][g];

                    const outputs = network.neurons.get("outputs");

                    for(let z = 0; z < outputs.length; z++) {
                        if(from === outputs[z]) {
                            continue pushLoop;
                        }
                    } 

                    possibleConnections.push([
                        from,
                        to
                    ]);
                }
            }
        }
    }

    // Get array of new connections
    let newConnectors = [];

    for(let i = 0; i < possibleConnections.length; i++) {
        if(Math.random() < settings.mutation.odds.newConnection) {
            newConnectors.push(
                possibleConnections[i]
            );
        }
    }

    // Add them
    for(let i = 0; i < newConnectors.length; i++) {
        let innovation = Innovation.ensure([...newConnectors[i], 'connector']);

        if(typeof innovation === 'undefined') {
            throw new Error(`Innvatiom.ensure has failed at newConnector mutation`);
        }

        const [min, max] = settings.mutation.newConnectionWeightRange;
        const newWeight = Math.random() * (max - min) + min;

        network.flipConnector(innovation.id, newWeight);
    }

    // Get array of connections for weight change
    let weightChangedIndices = [];

    for(let i = 0; i < network.connectors.get("length"); i++) {
        if(Math.random() < settings.mutation.odds.weightChange) {
            weightChangedIndices.push(i);
        }
    }

    // Add them
    for(let i = 0; i < weightChangedIndices.length; i++) {
        const [min, max] = settings.mutation.weightChangeRange;
        const shift = Math.random() * (max - min) + min;

        network.changeWeight(weightChangedIndices[i], shift);
    }

    const paired = network.genome.innovs[0].map((innovation, index) => [innovation, network.genome.innovs[1][index]]);
    paired.sort((a, b) => a[0] - b[0]);

    network.genome.innovs[0] = paired.map(pair => pair[0]);
    network.genome.innovs[1] = paired.map(pair => pair[1]);

    network.update();
}

module.exports = { mutate }