const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');

class Model {
  constructor(network, path) {
    // Create the canvas variables
    this.scale = 1;
    
    this.path = path;
    this.network = network;
    
    this.width = (longestArray(this.network.layers) * 4 + 4) * this.scale;
    this.height = (this.network.layers.length * 6 + 4) * this.scale;

    if(typeof this.network.id === "number") {
      this.canvas = createCanvas(this.width, this.height);
      this.ctx = this.canvas.getContext("2d")
    } else {
      throw new Error(`network doesnt have id????. it might not be a network. id: "${network.id}"`);
    }


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
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle='white';
    this.ctx.lineWidth = 1 * this.scale;
    this.ctx.beginPath();
    this.ctx.moveTo(1, 1);
    this.ctx.lineTo(20, 20);
    this.ctx.stroke();
  }
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

const render = path => {
  var pngStringify = require('console-png');
  const { verify } = require('crypto');
 
  var image = require('fs').readFileSync(__dirname + path);
 
  pngStringify(image, function (err, string) {
    if (err) throw err;
    console.log(string);
  });
}

module.exports = { Model }