const swap = {
  gate: (x, y) => [y, x],
  table: [
    [[0, 0], [0, 0]],
    [[0, 1], [1, 0]],
    [[1, 0], [0, 1]],
    [[1, 1], [1, 1]]
  ]
}

const same = {
  gate: x => x,
  table: [
    [[0], [0]],
    [[1], [1]]
  ]
}

const XOR = {
  gate: (x, y) => x ^ y,
  table: [
    [[0,0], [0]],
    [[1,0], [1]],
    [[0,1], [1]],
    [[1,1], [0]]
  ]
}

const AND = {
  gate: (x, y) => +(x===y),
  table: [
    [[0,0], [1]],
    [[1,0], [0]],
    [[0,1], [0]],
    [[1,1], [1]]
  ]
}

const XOR3 = {
  gate: (x, y, z) => x ^ y ^ z,
  table: [
      [[0, 0, 0], [0]],
      [[0, 0, 1], [1]],
      [[0, 1, 0], [1]],
      [[0, 1, 1], [0]],
      [[1, 0, 0], [1]],
      [[1, 0, 1], [0]],
      [[1, 1, 0], [0]],
      [[1, 1, 1], [1]]
  ]
}


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

const getAnswers = (neuralNetwork, gate) => {
  const inputTable = getCombos(gate.length);
  let answers = new Map();

  for(let i = 0; i < inputTable.length; i++) {
    answers.set(inputTable[i], neuralNetwork.run(...inputTable[i]));
  }

  return answers;
}


module.exports = { getAnswers, swap, XOR, AND, XOR3, same }
