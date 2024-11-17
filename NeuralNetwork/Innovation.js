let innovationCounter = 0;

class Innovation {
  constructor(from, to) {
    //error handling
    if(typeof from === 'undefined') {
      console.error('No "from" input provided to new innovation');
      throw new Error("issue above");
    }
    if(typeof to === 'undefined') {
      console.error('No "to" input provided to new innovation');
      throw new Error("issue above");
    }
    
    this.from = from;
    this.to = to;
    this.id = innovationCounter++;
  }
}

module.exports = { Innovation }
