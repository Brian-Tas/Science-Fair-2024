const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');

// Create a smaller canvas of 200x200 pixels (reduced resolution)
const canvas = createCanvas(20, 20); // Reduced canvas size
const ctx = canvas.getContext('2d');

// Set the fill color for the shape (a circle)
ctx.fillStyle = '#3498db'; // Blue
ctx.beginPath();
ctx.arc(10, 10, 10, 0, Math.PI * 2); // Draw a smaller circle at (100, 100) with a smaller radius
ctx.fill();






/*
    !! RENDERING !!
     |           |
     |           |
     V           V
*/



const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('outputs/output.png', buffer);

console.log('The low-quality PNG file was created.');


var pngStringify = require('console-png');
const { verify } = require('crypto');
 
var image = require('fs').readFileSync(__dirname + '/outputs/output.png');
 
pngStringify(image, function (err, string) {
  if (err) throw err;
  console.log(string);
})