// Import components
let connectorCounter = 0;

class Connector {
    constructor(innovation, weight, status=true) {
      if(typeof innovation === 'undefined') {
        console.error("No innovation provided at new connector");
        throw new Error("issue above");
      }
      if(typeof weight === 'undefined') {
        console.error("No weight provided at new connector");
        throw new Error("issue above");
      }
      this.innovation = innovation;
      this.weight = weight;
      this.id = innovation.id;
      this.status = status;
  }
}

class Neuron {
    constructor(id, type, value=0) {
      if(typeof id === 'undefined') {
        console.error('No id provided for Neuron construction');
        throw new Error("issue above");
      }

      if(typeof type === 'undefined') {
        console.error('No type specified at Neuron construction');
        throw new Error("issue above");
      }
  
      this.id = id;
      this.value = value;
      this.type = type;
      this.connectors = [];
    }
}
  
// Activation functions
const sigmoid = n => {
  return 1 / (1 + Math.exp(-n));
}

const tanh = n => {
  return Math.tanh(n);
}

class NeuralNetwork {
  constructor(genome, innovationTable, activationFunctions=["tanh", "tanh"]) {
    //Genome = [[innov id, weight],[innov id, weight]...]
    //Innov Table = [innov, innov...]

    // Class scoped innovation table
    this.innovationTable = innovationTable;
    this.genome = genome;
    this.activationFunctions = activationFunctions;

    if(typeof this.genome !== 'object') {
      console.error(`Please pass through a valid genome. Genome should be an object. Genome passed through: ${this.genome}`);
      throw new Error("issue above");
    }

    if(typeof this.innovationTable !== "object") {
      console.error(`Pass through a valid innovation table. First value should be an object, but is instead: ${this.innovationTable}`);
      throw new Error("issue above");
    }
    
    // List of all innovations this specific neural network has    
    this.innovations = [];

    for(let i = 0; i < this.genome.ids.length; i++) {
      this.innovations.push(
        this.innovationTable.get(this.genome.ids[i])
      );
    }
    
    // Create connectors & neurons for each
    const typeMap = ['sensors', 'hiddens', 'outputs', 'bias'];

    // Construct neurons
    this.neurons = new Map();

    this.neurons.set(0, new Neuron(0, typeMap[3]));

    for(let j = 0; j < this.genome.neurons.length; j++) {
      for(let i = 0; i < this.genome.neurons[j].length; i++) {

        const neuronId = this.genome.neurons[j][i];

        if(neuronId === 0) {
          console.error("Dont set neuron to bias node");
          throw new Error("issue above");
        }

        this.neurons.set(neuronId, new Neuron(neuronId, typeMap[j]));
      }

      this.neurons.set(typeMap[j], this.genome.neurons[j]);
    }

    // Construct connectors and assign nodes a "to" value
    this.connectors = new Map();
    
    for(let i = 0; i < this.innovations.length; i++) {
      const newConnector = new Connector(this.innovations[i], this.genome.weights[i], true);
      this.connectors.set(newConnector.id, newConnector);

      /*
          [] <- Neuron
          ||
          [] <- Connector
      */

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

    this.genome.order = this.order

    // Sets bias node
    this.neurons.get(0).value = 1;
    
    // Entire process ends
  }
  static activationFunctionMap = new Map([
    ["tanh", tanh],
    ["sigmoid", sigmoid]
  ]);
  fireConnector(id) {
    if(typeof id !== 'number') {
      console.error(`Id is not a number at FireConnector(). Id: ${id}`);
      throw new Error("issue above");
    }

    const firingConnector = this.connectors.get(id);

    if(typeof firingConnector === 'undefined') {
      console.error(`No connector with id of: "${id}" found at FireConnector()`);
      throw new Error("issue above");
    }

    if(firingConnector.status) {
      const toNeuronId = this.neurons.get(firingConnector.innovation.to);
      const fromNeuronId =  this.neurons.get(firingConnector.innovation.from);

      const firingNeurons = [fromNeuronId, toNeuronId];

      if(typeof firingNeurons[0] === 'undefined' || typeof firingNeurons[1] === 'undefined') {
        console.error(`No neuron with id of either "${fromNeuronId}" or "${toNeuronId}"`);
        throw new Error("issue above");
      }

      toNeuronId.value += NeuralNetwork.activationFunctionMap.get(this.activationFunctions[0])(fromNeuronId.value)  * firingConnector.weight;
    }
  }
  run(...args) {
    if(args.length !== this.neurons.get("sensors").length) {
      console.error(`NN arguments are different to sensor neurons. Inputs: "${args}" Sensors: ${this.neurons.get("sensors").length}`);
      throw new Error("issue above");
    }

    // Iterates through args and set inputs accordingly
    for(let i = 0; i < args.length; i++) {
      this.neurons.get(this.neurons.get("sensors")[i]).value = args[i] * 2 - 1;
    }

    // Iterates through all layers
    for(let i = 0; i < this.order.length; i++) {

      // Iterates through all connection in layer
      for(let j = 0; j < this.order[i].length; j++) {
        this.fireConnector(this.order[i][j]);
      }
    }

    const outputs = [];

    for(let i = 0; i < this.neurons.get("outputs").length; i++) {
      outputs.push(NeuralNetwork.activationFunctionMap.get(this.activationFunctions[1])(this.neurons.get(this.neurons.get("outputs")[i]).value)/2 + 0.5);
    }

    return outputs;
  }
}

let innovationCounter = 0;

class Innovation {
  constructor(from, to) {
    //error handling
    if(typeof from === 'undefined') {
      console.error('No "from" input provided to new innovation');
      throw new Error("issue above");
    }
    if(typeof to === 'undefined') {
      console.error('No "to" input provided to new innovation');
      throw new Error("issue above");
    }
    
    this.from = from;
    this.to = to;
    this.id = innovationCounter++;
  }

  static innovationTable = new Map();
  
  static newInnovation(arr) {
    const innovation = new Innovation(arr[0], arr[1]);

    Innovation.innovationTable.set(`${arr[0]}-${arr[1]}`, innovation);
    Innovation.innovationTable.set(innovation.id, innovation);
  }
}

class Genome {
  constructor(neurons = [[],[],[]], weights = [], innovIds = [], order=null) {
    if(typeof innovIds === 'undefined') {
      console.log("No innovation id's provided, using default");
    }
    if(typeof weights === 'undefined') {
      console.log("No weights provided, using default");
    }
    if(typeof neurons === 'undefined') {
      console.log("No neurons provided, using default");
    }
    if(weights.length !== innovIds.length) {
      console.error(`Innovation Id's aren't matched to innovation weights at Genome. Innovations: "${innovIds}" weights: ${weights}`);
      throw new Error("issue above");
    }

    this.ids = innovIds;
    this.weights = weights;
    this.neurons = neurons;
    this.order = order;
  }
}

export { NeuralNetwork, Genome, Innovation }