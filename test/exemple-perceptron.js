let Perceptron = require("./../layers/Perceptron");

let and = [
    { input: [0,0], output: [0] },
    { input: [0,1], output: [0] },
    { input: [1,0], output: [0] },
    { input: [1,1], output: [1] }
];

let or = [
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [1] }
];

let xor = [
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] }
];

let datosEntreno = and;

let perceptron = new Perceptron("lineal");
perceptron.loadTrainData(datosEntreno);
perceptron.initPesos();
perceptron.train(100, 0.1, true); 
let predd = perceptron.forward([1,1]);
console.log(predd);



