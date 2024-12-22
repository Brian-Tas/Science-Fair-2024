class Innovation {
  constructor(from, to, type, neuron) {
    // No error handling as error handing is handled in Innovation.newInnovation
    
    /*
      [] <- to
      || <- type (whether or not this is a neuron or connector)
      [] <- from
    */

    this.from = from;
    this.to = to;
    this.neuron = neuron;
    this.type = type;
    this.id = Innovation.id++;
  }

  static table = new Map();
  static neurons = [ 0 ]
  static id = 0;
  
  static newInnovation(arr) {
    if(typeof arr[0] !== 'number') {
      throw new Error(`First newInnovation input is not the from neuron. Type: ${typeof arr[0]} Value: ${arr[0]}`);
    }

    if(typeof arr[1] !== 'number') {
      throw new Error(`Second newInnovation input is not the 'to' neuron. Type: ${typeof arr[1]} Value: ${arr[1]}`);
    }

    if(arr[2] !== 'connector' && arr[2] !== 'neuron') {
      throw new Error(`newInnovation type is not neuron or connector. Value: ${arr[2]} Innovation: ${arr}`);
    }

    if(typeof Innovation.table.get(Innovation.con(arr)) !== 'undefined') {
      throw new Error(`Cannot add innovation to table thats already added. Innovation: ${Innovation.toCon(arr)}`)
    }

    let newNeuronId = null;

    if(arr[2] === 'neuron') {
      newNeuronId = Innovation.getNewNeuron();
      Innovation.addNeuron(newNeuronId);

      const connectorOne = [arr[0], newNeuronId, 'connector'];
      const connectorTwo = [newNeuronId, arr[1], 'connector'];
      
      Innovation.newInnovation(connectorOne);
      Innovation.newInnovation(connectorTwo);
    }

    const innovation = new Innovation(arr[0], arr[1], arr[2], newNeuronId);
    
    Innovation.table.set(Innovation.con(arr), innovation);
    //Innovation.table.set(Innovation.con([arr[0], arr[1], newNeuronId]), innovation);
    Innovation.table.set(innovation.id, innovation);

    const keyArray = Array.from(Innovation.table.keys());

    if(keyArray.length !== [... new Set(keyArray)].length) {
      throw new Error(`Duplicate innovation detected`);
    }
  }

  static addNeuron(id) {
    if(Innovation.neurons.includes(id)) {
      throw new Error(`Neuron already in Innovation list. Neuron: ${id} Innovation neurons: ${Innovation.neurons}`);
    }

    Innovation.neurons.push(id);
  }

  static getNewNeuron() {
    return Innovation.neurons[Innovation.neurons.length - 1] + 1;
  }

  static getNeuron() {
    return Innovation.neurons[Innovation.neurons.length - 1];
  }

  static con(arr) {
    return `${arr[0]}:${arr[1]}:${arr[2]}`
  }
}

module.exports = { Innovation }