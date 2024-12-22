const { networkInterfaces } = require("os");
const settings = require("../Storage/Settings.json");
const { Innovation } = require("../NeuralNetwork/Innovation");

const mutate = (network, mutationChance = null) => {
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
                for(let g = 0; g < network.layers[q].length; g++) {
                    possibleConnections.push([
                        network.layers[i][h],
                        network.layers[q][g]
                    ]);
                }
            }
        }
    }

    console.log(possibleConnections);
    // Get array of new connections
    let newConnectors = [];

    for(let i = 0; i < possibleConnections.length; i++) 
    {
        if(Math.random() < settings.mutation.odds.newConnection) {
            newConnectors.push(
                possibleConnections[i]
            );
        }
    }

    // Add them
    for(let i = 0; i < newConnectors.length; i++) {
        const rawInnovation = [...newConnectors[i], 'connector'];
        debugger;
        let innovation = Innovation.table.get(Innovation.con(rawInnovation));
        
        if(typeof innovation === 'undefined') {
            Innovation.newInnovation(rawInnovation);
            innovation = Innovation.table.get(Innovation.con(rawInnovation));
        }


        const [min, max] = settings.mutation.newConnectionWeightRange;
        const newWeight = Math.random() * (max - min) + min;

        network.flipConnector(innovation.id, newWeight);
    }

    // Get array of new neurons
    let newNeurons = []

    for(let i = 0; i < network.connectors.get("length"); i++) {
        if(Math.random() < settings.mutation.odds.newNeuron) {
            const connector = network.connectors.get(i)
            newNeurons.push(
                [connector.from, connector.to]
            );
        }
    }

    for(let i = 0; i < newNeurons.length; i++) {
        
    }
    // Call update
    // Get array of connections for weight change
    // Update them
    // Call update
}

module.exports = { mutate }