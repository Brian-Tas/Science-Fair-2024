let innovationCounter = 0;

class Innovation {
  constructor(from, to) {
    //error handling
    if(typeof from === 'undefined') {
      console.error('No "from" input provided to new innovation');
      process.exit(1);
    }
    if(typeof to === 'undefined') {
      console.error('No "to" input provided to new innovation');
      process.exit(1);
    }
    
    this.from = from;
    this.to = to;
    this.id = innovationCounter++;
  }
}

module.exports = { Innovation }
