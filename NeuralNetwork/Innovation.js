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

    Innovation.table.set(arr, innovation);

    if(arr[2] === 'neuron') {
      const connectorOne = new Innovation(arr[0])

      Innovation.table.set()
    }

    Innovation.table.set(innovation.id, innovation);
  }

  static counter = 0;
}

module.exports = { Innovation }
