class Innovation {
  constructor(from, to, type) {
    // No error handling as error handing is handled in Innovation.newInnovation
    
    /*
      [] <- to
      || <- type (whether or not this is a neuron or connector)
      [] <- from
    */

    this.from = from;
    this.to = to;
    this.type = type;
    this.id = Innovation.counter++;
  }

  static table = new Map();
  
  static newInnovation(arr) {
    if(typeof arr[0] !== 'number') {
      throw new Error(`First newInnovation input is not the from neuron. Type: ${typeof arr[0]} Value: ${arr[0]}`);
    }

    if(typeof arr[1] !== 'number') {
      throw new Error(`Second newInnovation input is not the 'to' neuron. Type: ${typeof arr[1]} Value: ${arr[1]}`);
    }

    if(typeof arr[2] !== 'string') {
      throw new Error(`Third newInnovaiton input is not the innov type. Type (should be string): ${typeof arr[2]} Value: ${arr[2]}`)
    }

    if(arr[2] !== 'neuron' && arr[2] !== 'connector') {
      throw new Error(`newInnovation type is not 'neuron' or 'connector'. Value: ${arr[2]}`);
    }

    const innovation = new Innovation(arr[0], arr[1], arr[2]);

    Innovation.table.set(Innovation.toCon(arr), innovation);
    Innovation.table.set(innovation.id, innovation);

    if(arr[2] === 'neuron') {
      const newNeuronId = Innovation.getNeuron();
      Innovation.addNeuron(newNeuronId);

      const connectorOne = [arr[0], newNeuronId, 'connector'];
      const connectorTwo = [newNeuronId, arr[1], 'connector'];
      
      Innovation.newInnovation(connectorOne);
      Innovation.newInnovation(connectorTwo);
    }

  }

  static addNeuron(id) {
    if(Innovation.neurons.includes(id)) {
      throw new Error(`Neuron already in Innovation list. Neuron: ${id} Innovation neurons: ${Innovation.neurons}`);
    }

    Innovation.neurons.push(id);
  }

  static getNeuron() {
    return Innovation.neurons[Innovation.neurons.length - 1] + 1;
  }

  static toCon(arr) {
    return `${arr[0]}->${arr[1]}: ${arr[2]}`;
  }

  static neurons = [ 0 ];
  static counter = 0;
}

module.exports = { Innovation }
