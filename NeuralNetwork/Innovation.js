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

  static table = new Map();
  
  static newInnovation(arr) {
    const innovation = new Innovation(arr[0], arr[1]);

    Innovation.table.set(`${arr[0]}-${arr[1]}`, innovation);
    Innovation.table.set(innovation.id, innovation);
  }
}

module.exports = { Innovation }
