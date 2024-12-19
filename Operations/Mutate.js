const { networkInterfaces } = require("os");
const settings = require("../Storage/Settings.json");

const mutate = (network, mutationChance = null) => {
    // Check if mutation will happen
    if(Math.random() < settings.mutation.odds.mutation) {
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
        [8, 2, 1, 0] <-|(layers above)

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

        // Get array of new connections
        // Add them
        // Call update
        // Get array of new neurons
        // Add them
        // Call update
        // Get array of connections for weight change
        // Update them
        // Call update
    }
}

module.exports = { mutate }