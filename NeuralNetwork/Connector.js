let connectorCounter = 0;

class Connector {
    constructor(innovation, weight, status=true) {
      if(typeof innovation === 'undefined') {
        console.error("No innovation provided at new connector");
        throw new Error("issue above");
      }
      if(typeof weight === 'undefined') {
        console.error("No weight provided at new connector");
        throw new Error("issue above");
      }
      this.innovation = innovation;
      this.weight = weight;
      this.id = innovation.id;
      this.status = status;
  }
}
  
module.exports = { Connector };