const NeuralNetwork = require("./../layers/NeuralNetwork");

let xor = [
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] }
];

let or = [
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [1] }
];

let layers = [
    {
        'type': 'densed',
        'm': 4,
        'act': 'escalon',
        'momento': 0.5
    },
    {
        'type': 'densed',
        'm': 1,
        'act': 'escalon',
        'momento': 0.2
    }
];

let redNeuronal = new NeuralNetwork(layers, 2);
redNeuronal.loadTrainData(xor);
redNeuronal.initPesos();
redNeuronal.train(100, 0.08, true);