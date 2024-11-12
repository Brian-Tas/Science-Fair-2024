// Import components
const { Connector } = require("./Connector.js");
const { Neuron } = require("./Neuron.js");

class NeuralNetwork {
  constructor(genome, innovationTable) {
    //Genome = [[innov id, weight],[innov id, weight]...]
    //Innov Table = [innov, innov...]

    // Class scoped innovation table
    this.innovationTable = innovationTable;
    this.genome = genome;

    if(typeof this.genome !== 'object') {
      console.error(`Please pass through a valid genome. Genome should be an object. Genome passed through: ${this.genome}`);
      process.exit(1);
    }

    if(typeof this.innovationTable !== 'array' && typeof this.innovationTable[0] !== 'object') {
      console.error(`Pass through a valid innovation table. First value should be an object, but is instead: ${this.innovationTable[0]}`);
      process.exit(1);
    }
    
    // List of all innovations this specific neural network has    
    this.innovations = [];

    for(let i = 0; i < this.genome.ids.length; i++) {
      this.innovations.push(
        this.innovationTable[this.genome.ids[i]]
      );
    }
    
    // Create connectors & neurons for each
    const typeMap = ['sensors', 'hiddens', 'outputs'];

    // Construct neurons
    this.neurons = new Map();

    for(let j = 0; j < this.genome.neurons.length; j++) {
      for(let i = 0; i < this.genome.neurons[j].length; i++) {
        //this.neurons.push(new Neuron(this.genome.neurons[j][i], typeMap[j]));
        this.neurons.set(this.genome.neurons[j][i], new Neuron(this.genome.neurons[j][i], typeMap[j]));
      }

      this.neurons.set(typeMap[j], this.genome.neurons[j]);
    }

    // Construct connectors and assign nodes a "to" value
    this.connectors = new Map();
    
    for(let i = 0; i < this.innovations.length; i++) {
      const newConnector = new Connector(this.innovations[i], this.genome.weights[i], true);
      this.connectors.set(newConnector.id, newConnector);

      this.neurons.get(newConnector.innovation.to).connectors.push(newConnector.id);
    }

    // Construct feed-forward 
    this.order = this.genome.order;
    
    if(this.order === null) {
      this.order = [];

      let currentNeuronLevel = this.neurons.get("outputs");

      for(let h = 0; h < this.connectors.size; h++) {
        let connectors = [];

        // Iterates through currentNeuronLevel
        for(let i = 0; i < currentNeuronLevel.length; i++) {
          const currentNeuron = this.neurons.get(currentNeuronLevel[i]);
          
          // Iterates through all connections for a given neuron and adds them to connectors
          for(let j = 0; j < currentNeuron.connectors.length; j++) {
            connectors.push(this.connectors.get(currentNeuron.connectors[j]));
          }
        }

        connectors = [...new Set(connectors)];
        let connectorsId = [];

        for(let i = 0; i < connectors.length; i++) {
          connectorsId.push(connectors[i].id);
        }


        currentNeuronLevel = [];

        for(let i = 0; i < connectors.length; i++) {
          currentNeuronLevel.push(
            connectors[i].innovation.from
          );
        }

        // Checks if there are no more neurons to be ran
        if(currentNeuronLevel.length === 0) {
          break;
        }

        this.order.unshift(connectorsId);
      } 
    }
    // Entire process ends
  }
  fireConnector(id) {
    if(typeof id !== 'number') {
      console.error(`Id is not a number at FireConnector(). Id: ${id}`);
      process.exit(1);
    }

    const firingConnector = this.connectors.get(id);

    if(typeof firingConnector === 'undefined') {
      console.error(`No connector with id of: "${id}" found at FireConnector()`);
      process.exit(1);
    }

    if(firingConnector.status) {
      const toNeuronId = this.neurons.get(firingConnector.innovation.to);
      const fromNeuronId =  this.neurons.get(firingConnector.innovation.from);

      const firingNeurons = [fromNeuronId, toNeuronId];

      if(typeof firingNeurons[0] === 'undefined' || typeof firingNeurons[1] === 'undefined') {
        console.error(`No neuron with id of either "${fromNeuronId}" or "${toNeuronId}"`);
        process.exit(1);
      }

      toNeuronId.value += fromNeuronId.value * firingConnector.weight;
    }
  }
  run() {
    // Iterates through all layers
    for(let i = 0; i < this.order.length; i++) {

      // Iterates through all connection in layer
      for(let j = 0; j < this.order[i].length; j++) {
        this.fireConnector(this.order[i][j]);
      }
    }
  }
}

module.exports = { NeuralNetwork }
