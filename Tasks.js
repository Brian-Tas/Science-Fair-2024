const swap = (x, y) => [y, x];
const XOR = (x, y) => x ^ y;
const AND = (x , y) => +(x === y);
const XOR3 = (x, y, z) => x ^ y ^ z;


// Makes all combinations for an amount of inputs
const getCombos = n => {
  if(n === 0) { return [[]]; }

  const smallerCombinations = getCombos(n - 1);
  return smallerCombinations.flatMap(combo => [
    [...combo, 0],
    [...combo, 1]
  ]);
}

// Returns array of all possible outputs
const getTable = gate => {
  const outputs = [];
  const combos = getCombos(gate.length);

  for(let i = 0; i < combos.length; i++) {
    outputs.push(
      gate(...combos[i])
    );
  }

  return outputs;
}

const getFitness = (neuralNetwork, gate) => {
  const inputTable = getCombos(gate.length);
  let answers = new Map();

  for(let i = 0; i < inputTable.length; i++) {
    answers.set(inputTable[i], neuralNetwork.run(...inputTable[i]));
  }

  return answers;
}


module.exports = { getFitness, swap, XOR, AND, XOR3 }
