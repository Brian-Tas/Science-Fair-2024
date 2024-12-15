class Genome {
    constructor(innovs, neurons, order = null, layers = null) {
      
      
      const [ innovIds, weights ] = innovs;

      if(weights.length !== innovIds.length) {
        console.error(`Innovation Id's aren't matched to innovation weights at Genome. Innovations: "${innovIds}" weights: ${weights}`);
        throw new Error("issue above");
      }
  
      this.ids = innovIds;
      this.weights = weights;
      this.neurons = neurons;
      this.order = order;
      this.layers = layers;
      this.id = Genome.id++;
    }

    static id = 0;
  }
  
  module.exports = { Genome }
