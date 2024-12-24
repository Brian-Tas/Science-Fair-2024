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
    this.genome = genome
    this.activationFunctions = activationFunctions;

    this.genome.innovs[0].sort((a,b)=>a-b)

    if(this.genome.innovs[0].length !== [...new Set(this.genome.innovs[0])].length) {
      throw new Error(`Duplicate Innovs detected. Innovs: ${this.genome.innovs[0]}`)
    }

    if(this.genome.innovs[0].length !== this.genome.innovs[1].length) {
      throw new Error(`Innovs aren't matched to weights. Innovs: ${this.genome.innovs[0]}\nWeights: ${this.genome.innovs[1]}`)
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
      
      if(typeof innovation === 'undefined') {
        console.table(Innovation.table)
        throw new Error(`Innovation is not defined at newConnector. Genome: ${this.genome.innovs[0]} InnovationTable above`)
      }
      
      if(innovation.type === 'connector') {  
        const connector = new Connector(
          innovation,
          this.genome.innovs[1][i]
        );
  
        this.connectors.set(
          connectorCounter,
          connector
        );
  
        this.connectors.set(
          Innovation.con([innovation.from, innovation.to, innovation.type]),
          connector
        )

        
        this.neurons.get(innovation.from).from.push(connectorCounter);
        this.neurons.get(innovation.to).to.push(connectorCounter);
        connectorCounter++;
      }

    }

    this.connectors.set('length', connectorCounter);
    
    let connectorIdArray = [];
    const connectorValues = Array.from(this.connectors.values());

    for(let i = 0; i < (connectorValues.length - 1) / 2; i++) {
      connectorIdArray.push(connectorValues[i*2+1].id);
    }

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
    for(let i = 1; i < this.neurons.get("length") - 1; i++) { // Starts at i = 1 to skip the bias node
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
    if(!this.genome.innovs[0].includes(innovId)) {
      const innovation = Innovation.table.get(innovId);
      
      if(typeof innovation === 'undefined') {
        throw new Error(`Passed Innovation to ".addNeuron" is not found. Id: ${innovId}`);
      }
  
      if(innovation.type !== 'neuron') {
        throw new Error(`Passed Innovation to ".addNeuron" is not a neuron innovation. Id:  ${innovId} Innovation type (should be neuron): ${innovation.type}`);
      }
  
      if(this.genome.innovs[0].includes(innovId)) {
        throw new Error(`Passed Innovation to ".addNeuron" is already included in genome. Id: ${innovId} Genome: ${this.genome.innovs[0]}`);
      }
  
      const connector1 = Innovation.table.get(Innovation.con([innovation.from, innovation.neuron, 'connector']));
      const connector2 = Innovation.table.get(Innovation.con([innovation.neuron, innovation.to, 'connector']));
      
      if(typeof connector1 === 'undefined') {
        throw new Error(`From connector is undefined at "addNeuron". This shouldnt be possible, as checks already ensured that the neuron innovation exists, so this error means that adding a newNeuron to the innov table failed somehow.`);
      }
      
      if(typeof connector2 === 'undefined') {
        throw new Error(`To connector is undefined at "addNeuron". This shouldnt be possible, as checks already ensured that the neuron innovation exists, so this error means that adding a newNeuron to the innov table failed somehow.`);
      }
  
      const oldConnector = this.connectors.get(Innovation.con([innovation.from, innovation.to, 'connector']));
  
      if(typeof oldConnector === 'undefined') {
        throw new Error(`The connector trying to be replaced at addNeuron does not exist in this neural network. Connectors: ${Array.from(this.connectors.keys())} Connector: ${Innovation.con([innovation.from, innovation.to, null])}`);
      }

      try {
        this.removeInnov(oldConnector.id);
      } catch(err) {
        console.table(Innovation.table);
        console.table(Array.from(this.connectors.values()));
        console.table(this.genome);
        this.render();
        throw new Error(err);
      }
      this.addInnov(innovation.id, null);
      this.addInnov(connector1.id, oldConnector.weight);
      this.addInnov(connector2.id, 1);
  
      this.genome.neurons[1].push(innovation.neuron);
  
      this.update();
    }

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

    if(typeof id !== 'number') {
      throw new Error(`new Innov id is not a number. Id: ${id}`);
    }

    if(typeof weight !== 'number' && weight !== null) {
      throw new Error(`Weight is not a number or null. Weight: ${weight}`)
    }

    this.genome.innovs[0].push(id);
    this.genome.innovs[1].push(weight);
  }

  changeWeight(index, shift) { // Index of innovation's weight whos being changed and how much its being changed by
    const connector = this.connectors.get(index);

    if(typeof connector === 'undefined') {
      throw new Error(`Invalid index passed to .changeWeight. Index: ${index} Genome: ${this.genome.innovs[0]}`);
    }

    connector.weight += shift;
    this.genome.innovs[1][index] += shift;
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