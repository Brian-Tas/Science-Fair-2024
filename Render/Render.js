const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');

// Create a canvas of 400x400 pixels
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

// Set background color
ctx.fillStyle = '#ffffff'; // White
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Set the fill color for the shape (a circle)
ctx.fillStyle = '#3498db'; // Blue
ctx.beginPath();
ctx.arc(200, 200, 100, 0, Math.PI * 2); // Draw a circle at (200, 200) with a radius of 100
ctx.fill();

// Export the canvas to a PNG file
const buffer = canvas.toBuffer('image/png'); // Generate a PNG buffer

// Write the PNG buffer to a file
fs.writeFileSync('output.png', buffer);

console.log('The PNG file was created.');
