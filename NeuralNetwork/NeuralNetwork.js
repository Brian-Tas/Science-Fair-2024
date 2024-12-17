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

    this.neurons.set('length', neuronCounter); 
    this.neurons.set(0, new Neuron(0, typeMap[3]));
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
    debugger;
    for(let i = 1; i < this.neurons.get("length"); i++) {
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
    debugger;

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
  mutate(maxWeightAffect, newNeuronChance, newConnectorChance, newWeightChance, newMutation) {
    const weightAffect = maxWeightAffect || settings.mutation.maxWeightAffect;

    const odds = {
      newNeuron: newNeuronChance || settings.mutation.odds.newNeuron,
      newConnection: newConnectorChance || settings.mutation.odds.newConnection,
      weightChange: newWeightChance || settings.mutation.odds.weightChange,
      mutation: newMutation || settings.mutation.odds.mutation
    };

    if(Math.random() < odds.mutation) {
      // Get all valid new connections
      let possibleConnections = [];
  
      for(let i = 0; i < this.layers.length; i++) {
        for(let j = 0; j < this.layers[i].length; j++) {
          for(let h = i + 1; h < this.layers.length; h++) {
            for(let q = 0; q < this.layers[h].length; q++) {
              possibleConnections.push([this.layers[i][j], this.layers[h][q]]);
            }
          }  
        }
      }
  
      let newConnections = [];
  
      for(let i = 0; i < possibleConnections.length; i++) {
        if(Math.random() < odds.newConnection) {
          newConnections.push(possibleConnections[i]);
        }
      }

      // Get all existing connections
      let existingConnections = [];
      
      for(let i = 0; i < this.connectors.get('length'); i++) {
        let connector = this.connectors.get(i);

        existingConnections.push([ connector.from, connector.to ]);
      }

      // Choose connection to create new neuron(s)
      let newNeuronChosenConnections = [];

      for(let i = 0; i < existingConnections.length; i++) {
        if(Math.random() < odds.newNeuron) {
          newNeuronChosenConnections.push(existingConnections[i]);
        }
      }

      // Create the now chosen neuron(s)
      newNeuronChosenConnections = [ [ 3, 4 ] ];

      for(let i = 0; i < newNeuronChosenConnections.length; i++) {
        const newNeuronInnovationRaw = [...newNeuronChosenConnections[i].flat(), 'neuron'];

        debugger;

        let newNeuronInnovation = Innovation.table.get(Innovation.toCon(newNeuronInnovationRaw));

        if(typeof newNeuronInnovation === 'undefined') {
          Innovation.newInnovation(newNeuronInnovationRaw);
          newNeuronInnovation = Innovation.table.get(Innovation.toCon(newNeuronInnovationRaw));
        }

        const newConnector1Id = newNeuronInnovation.id + 1;
        const newConnector2Id = newNeuronInnovation.id + 2;

      /*[]
        || <- newConnector2Id
        [] <- newNeuronInnovationId
        || <- newConnector1Id
        []*/

        const oldConnector = this.connectors.get(
          Innovation.toCon([...newNeuronChosenConnections[i], 'connector'].flat())
        );
        
        console.table(this.genome)

        this.genome.innovs.splice(this.genome.innovs.indexOf(oldConnector.id), 1);

        this.genome.neurons[1].push(Innovation.getNeuron() - 1);

        this.genome.innovs[0].push(newConnector1Id);
        this.genome.innovs[0].push(newConnector2Id);
        this.genome.innovs[0].push(newNeuronInnovation.id);

        console.table(this.genome)
      }
    }
  }
}


module.exports = { NeuralNetwork }