const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');

class Model {
  constructor(network, path) {
    // Create the canvas variables
    this.width = 20;
    this.height = 20;

    this.path = path;
    this.network = network;

    /*if(this.network.id) {
      this.canvas = createCanvas(this.width, this.height);
    } else {
      throw new Error(`network doesnt have id????. it might not be a network. id: "${network.id}"`);
    }*/
  }

  PNGify() {
    const buffer = this.canvas.toBuffer('image/png');
    fs.writeFileSync(this.path, buffer);
  }

  render() {
    render(this.path);
  }
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