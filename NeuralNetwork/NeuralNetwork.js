// Import components
const { Model } = require("../Render/Model.js");
const { Connector } = require("./Connector.js");
const { Neuron } = require("./Neuron.js");
const { Innovation } = require('./Innovation.js');
const settings = require("../Storage/Settings.json");

// Activation functions
const sigmoid = n => {
  return 1 / (1 + Math.exp(-n));
}

const tanh = n => {
  return Math.tanh(n);
}

class NeuralNetwork {
  constructor(genome, activationFunctions=["tanh", "tanh"]) {
    this.genome = genome;
    this.activationFunctions = activationFunctions;

    if(this.genome.innovs[0].length !== [...new Set(this.genome.innovs[0])].length) {
      throw new Error(`Duplicate Innovs detected. Innovs: ${this.genome.innovs[0]}`)
    }

    if(this.genome.innovs[0].length !== this.genome.innovs[1].length) {
      throw new Error(`Innovs aren't matched to weights. Innovs: ${this.genome.innovs[0]} \nWeights: ${this.genome.innovs[1]}`)
    }

    this.neurons = new Map();
    this.connectors = new Map();

    // Create neuron map first
    // V for length
    let neuronCounter = 0;

    const typeMap = [ "sensors", "hiddens", "outputs", "bias" ];

    for(let i = 0; i < this.genome.neurons.length; i++) {
      for(let j = 0; j < this.genome.neurons[i].length; j++) {
        this.neurons.set(
          this.genome.neurons[i][j],
          new Neuron(
            this.genome.neurons[i][j],
            typeMap[i]
          )
        );    

        this.neurons.set(typeMap[i], this.genome.neurons[i]);
        neuronCounter++;
      }

    }

    this.neurons.set(0, new Neuron(0, typeMap[3]));
    neuronCounter++;

    this.neurons.set('length', neuronCounter);

    this.neurons.set('all', [this.neurons.get('sensors'), this.neurons.get('hiddens'), this.neurons.get('outputs')].flat())

    // Create connector map
    let connectorCounter = 0;

    for(let i = 0; i < this.genome.innovs[0].length; i++) {
      const innovation = Innovation.table.get(this.genome.innovs[0][i]);

      if(innovation.type === 'neuron') {
        continue;
      }

      const connector = new Connector(
        innovation,
        this.genome.innovs[1][i]
      );

      this.connectors.set(
        connectorCounter,
        connector
      );

      this.connectors.set(
        Innovation.toCon([innovation.from, innovation.to, innovation.type]),
        connector
      )

      this.neurons.get(innovation.from).from.push(connectorCounter);
      this.neurons.get(innovation.to).to.push(connectorCounter);
      connectorCounter++;
    }

    this.connectors.set('length', connectorCounter);

    // Construct feed-forward 
    
    this.layers = [];

    let currentNeuronLevel = [...this.neurons.get("sensors"), 0];

    let fired = [];

    for(let k = 0; k < this.neurons.get("length"); k++) {
      /*
          .from =
          []
          || <- value
          [] <- neuron

          .to =
          [] <- neuron
          || <- value
          [] 

      */

      let connectors = Array.from(currentNeuronLevel, x => this.neurons.get(x).from).flat();

      fired.push(connectors);

      fired = fired.flat();
      fired = [...new Set(fired)];

      this.layers.push(currentNeuronLevel);

      currentNeuronLevel = Array.from(connectors, x => this.connectors.get(x).to);
      currentNeuronLevel = [...new Set(currentNeuronLevel)];

      let marked = [];

      for(let i = 0; i < currentNeuronLevel.length; i++) {
        const neuronConnectors = this.neurons.get(currentNeuronLevel[i]).to;

        neuronConnectors.forEach(connector => {
          if(!fired.includes(connector)) {
            marked.push(currentNeuronLevel[i]);
          }
        });
      }

      marked = [...new Set(marked)];

      marked.forEach(mark => {
        currentNeuronLevel.splice(currentNeuronLevel.indexOf(mark), 1);
      });

      if(currentNeuronLevel.length === 0) {
        break;
      }
    }

    this.order = [];

    for(let i = 0; i < this.layers.length - 1; i++) {
      let connectorLayer = [];

      for(let j = 0; j < this.layers[i].length; j++) {
        connectorLayer.push(
          this.neurons.get(
            this.layers[i][j]
          ).from
        );
      }
      
      connectorLayer = connectorLayer.flat();
      this.order.push(connectorLayer);
    }
    // Sets bias node
    this.neurons.get(0).value = 1;
    
    // Entire process ends
  }
  static activationFunctionMap = new Map([
    ["tanh", tanh],
    ["sigmoid", sigmoid]
  ]);
  static id = 0;
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

    const toNeuronId = this.neurons.get(firingConnector.to);
    const fromNeuronId =  this.neurons.get(firingConnector.from);

    const firingNeurons = [fromNeuronId, toNeuronId];

    if(typeof firingNeurons[0] === 'undefined' || typeof firingNeurons[1] === 'undefined') {
      console.error(`No neuron with id of either "${fromNeuronId}" or "${toNeuronId}"`);
      throw new Error("issue above");
    }

    toNeuronId.value += NeuralNetwork.activationFunctionMap.get(this.activationFunctions[0])(fromNeuronId.value)  * firingConnector.weight;
  }
  run(...args) {
    for(let i = 1; i < this.neurons.get("length") - 1; i++) {
      debugger;
      this.neurons.get(this.neurons.get('all')[i]).value = 0;
    }
    
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

  render() {
    this.model = new Model(this);

    this.model.model();
    this.model.PNGify();
    this.model.render();
  }

  flipConnector(id, weight) {
    if(this.genome.innovs[0].includes(id)) {
      // Runs if id is included || remove connector
      this.removeInnov(id);
    } else {
      // Runs if id is not included || new connector
      this.addInnov(id, weight);
    }

    this.update();
  }

  addNeuron(innovId) {
    const innovation = Innovation.table.get(innovId);

    if(typeof innovation === 'undefined') {
      throw new Error(`Passed Innovation to ".addNeuron" is not found. Id: ${innovId}`);
    }

    if(typeof innovation.type !== 'number') {
      throw new Error(`Passed Innovation to ".addNeuron" is not a neuron innovation. Id:  ${innovId} Innovation type (should be an int- null means connector): ${innovation.type}`);
    }

    const connector1 = Innovation.table.get(Innovation.toCon([innovation.from, innovation.type, null]));
    const connector2 = Innovation.table.get(Innovation.toCon([innovation.type, innovation.to, null]));

    if(typeof connector1 === 'undefined') {
      throw new Error(`From connector is undefined at "addNeuron". This shouldnt be possible, as checks already ensured that the neuron innovation exists, so this error means that adding a newNeuron to the innov table failed somehow.`);
    }

    if(typeof connector2 === 'undefined') {
      throw new Error(`To connector is undefined at "addNeuron". This shouldnt be possible, as checks already ensured that the neuron innovation exists, so this error means that adding a newNeuron to the innov table failed somehow.`);
    }

    const oldConnector = this.connectors.get(Innovation.toCon([innovation.from, innovation.to, null]));

    if(typeof oldConnector === 'undefined') {
      throw new Error(`The connector trying to be replaced at addNeuron does not exist in this neural network. Connector: ${Innovation.toCon([innovation.from, innovation.to, null])}`);
    }

    this.removeInnov(oldConnector.id);
    this.addInnov(innovation.id, null);
    this.addInnov(connector1.id, oldConnector.weight);
    this.addInnov(connector2, 1);

    this.update();
  }

  removeInnov(id) {
    const index = this.genome.innovs[0].indexOf(id);

    if(index === -1) {
      throw new Error(`Cannot find innov at removeInnov. id: ${id} Genome: ${this.genome.innovs[0]}`);
    }

    this.genome.innovs[0].splice(index, 1);
    this.genome.innovs[1].splice(index, 1);
  }

  addInnov(id, weight) {
    if(this.genome.innovs[0].includes(id)) {
      throw new Error(`Genome already includes innov at addInnov. id: ${id} Genome: ${this.genome.innovs[0]}`)
    }

    this.genome.innovs[0].push(id);
    this.genome.innovs[1].push(weight);
  }

  update(genome = this.genome) {
    const newNetwork = new NeuralNetwork(this.genome);

    this.connectors = newNetwork.connectors;
    this.neurons = newNetwork.neurons;
    this.order = newNetwork.order;
    this.layers = newNetwork.layers;
  }
}


module.exports = { NeuralNetwork }