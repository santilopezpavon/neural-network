const LayerDense = require('./LayerDense');
const Mathjs = require('mathjs');
class SoftmaxLayer extends LayerDense {
    constructor(n, m, activacion, momento = 0) {
        super(n, m, activacion, momento);
    }

    softmax(arr) {
        let y = [];
        let suma = 0;
        let mx = 0;
    
        arr.forEach(element => {
            if(element > mx) {
                mx = element;
            }
        });
    
        for (let i = 0; i < arr.length; i++) {
            y[i] = Math.exp(arr[i] - mx); 
            suma += y[i]; 
        }
    
        for (let i = 0; i < arr.length; i++) {
            y[i] = y[i] / suma;
        }     
        return y;    
    }

    forward(inputs = []) {
        this.inputs = inputs;
        let pesosInputs = Mathjs.multiply(this.inputs, this.pesos); 
        this.net = Mathjs.add(pesosInputs, this.sesgos);   
        this.out = this.softmax(this.net);
        return this.out;
    }

    backward(error = []) {
        this.error = error;
        for (let j = 0; j < this.out.length; j++) {
            if(this.activacion == 'cross') {
                this.delta[j] = error[j];
            } else {
                this.delta[j] = 0;
                for (let k = 0; k < this.out.length; k++) {
                    if(k == j) {
                        this.delta[j] += error[k] * this.out[k] * (1 - this.out[j]);
                    } else {
                        this.delta[j] += error[k] * this.out[k] * - this.out[j];
                    }
                }
            }
        }
        let trans = Mathjs.transpose(this.pesos);
        return Mathjs.multiply(this.delta, trans);     
    }
}
module.exports = SoftmaxLayer;