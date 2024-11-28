class Genome {
    constructor(neurons = [[],[],[]], weights = [], innovIds = [], order=null, layers=null) {
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
      this.layers = layers;
    }
  }
  
  module.exports = { Genome }
