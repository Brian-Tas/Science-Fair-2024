let connectorCounter = 0;

class Connector {
    constructor(innovation, weight, status) {
      if(typeof innovation === 'undefined') {
        console.error("No innovation provided at new connector");
        process.exit(1);
      }
      if(typeof weight === 'undefined') {
        console.error("No weight provided at new connector");
        process.exit(1);
      }
      this.innovation = innovation;
      this.weight = weight;
      this.id = innovation.id;
      this.status = true;
    }
  }
  
  module.exports = { Connector };
