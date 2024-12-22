var pngStringify = require('console-png');
const { verify } = require('crypto');
const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const seedrandom = require('seedrandom');
const rng = seedrandom('927018'); 

class Model {
  constructor(network) {
    // Create the canvas variables
    this.scale = 0.9;
    
    this.path = `/network.png`;
    this.network = network;
    
    this.width = (this.network.layers.length * 8) * this.scale + 4;
    this.height = (this.network.neurons.get("length") * 4) * this.scale + 10;

    this.lanes = [];

    for(let i = 0; i < this.network.neurons.get("length"); i++) {
      this.lanes.push(i);
    }

    this.canvas = createCanvas(this.width, this.height);
    this.ctx = this.canvas.getContext("2d");
  }

  PNGify() {
    const buffer = this.canvas.toBuffer('image/png');
    fs.writeFileSync("./Render" + this.path, buffer);
  }

  render() {
    render(this.path);
  }

  model() {
    this.ctx.fillStyle='black';
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.ctx.strokeStyle='white';
    this.ctx.fillStyle = 'blue'
    this.ctx.lineWidth = 1;

    let neurons = new Map();
    let neuronPostions = []
    let lanes = new Map();
    let allNeurons = [...this.network.neurons.get('all')];

    for(let i = 0; i < this.network.layers.length; i++) {
      for(let j = 0; j < this.network.layers[i].length; j++) {
        const lane = this.getLane();
        neuronPostions.push([this.getX(i), this.getY(lane), 3, this.ctx]);

        lanes.set(lane, this.network.layers[i][j]);

        neurons.set(this.network.layers[i][j], [this.getX(i) + 1, this.getY(lane) + 1]);
        allNeurons.splice(allNeurons.indexOf(this.network.layers[i][j]), 1);
      }
    }
    
    for(let i = 0; i < allNeurons.length; i++) {
      neurons.set(allNeurons[i], this.getX(this.network.layers.length), this.getY(this.getLane()))
    }

    for(let i = 0; i < this.network.connectors.get("length"); i++) {
      const connector = this.network.connectors.get(i)

      try {
        line(neurons.get(connector.from), neurons.get(connector.to), this.ctx);
      } catch (error) {
        console.warn("Neurons are cut off at render");
      }
    }

    neuronPostions.forEach(postion => {
      rect(...postion)
    });
  }

  getLane(layer) {
    const random = Math.floor(rng() * this.lanes.length);
    const answer = this.lanes[random];
    this.lanes.splice(random, 1);

    return answer
  }

  getX(neuron) {
    return (neuron * 8) * this.scale + 4;
  }
  
  getY(layer) {
    return (layer * 4) * this.scale + 4;
  }

  static modelIds = 0;
}

const longestArray = arr => {
  let longest = 0;

  for(let i = 0; i < arr.length; i++) {
    if(longest < arr[i].length) {
      longest = arr[i].length;
    }
  }

  return longest;
}

const line = (coord1, coord2, ctx) => {
  ctx.beginPath();
  ctx.moveTo(...coord1);
  ctx.lineTo(...coord2);
  ctx.stroke();
}

const rect = (x, y, s, ctx) => {
  ctx.fillRect(x, y, s, s);
}

const render = path => {
 
  var image = require('fs').readFileSync(__dirname + path);
 
  pngStringify(image, function (err, string) {
    if (err) throw err;
    console.log(string);
  });

}

module.exports = { Model }
