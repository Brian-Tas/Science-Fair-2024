let connectorCounter = 0;

class Connector {
    constructor(innovation, weight) {
      if(typeof innovation === 'undefined') {
        console.error("No innovation provided at new connector");
        throw new Error("issue above");
      }
      if(typeof weight === 'undefined') {
        console.error("No weight provided at new connector");
        throw new Error("issue above");
      }
      this.weight = weight;
      this.id = innovation.id;
      this.from = innovation.from;
      this.to = innovation.to;
  }
}
  
module.exports = { Connector };