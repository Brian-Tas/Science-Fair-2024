class Neuron {
    constructor(id, type, value=0) {
      if(typeof id === 'undefined') {
        console.error('No id provided for Neuron construction');
        process.exit(1);
      }

      if(typeof type === 'undefined') {
        console.error('No type specified at Neuron construction');
        process.exit(1);
      }
  
      this.id = id;
      this.value = value;
      this.type = type;
      this.connectors = [];
    }
  }
  
  module.exports = { Neuron }
