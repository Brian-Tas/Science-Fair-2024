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
        console.error("Innovation Id's aren't matched to innovation weights at Genome");
        process.exit(1);
      }
  
      this.ids = innovIds;
      this.weights = weights;
      this.neurons = neurons;
      this.order = order;
    }
  }
  
  module.exports = { Genome }
