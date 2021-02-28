const Activacion = require("./Activacion");
const Mathjs = require('mathjs');

class LayerDense { 
    constructor(n, m, activacion, momento = 0) {
        this.n = n;
        this.m = m;
        this.activacion = activacion;
        this.pesos = [];
        this.sesgos = [];
        this.inputs = [];
        this.net = [];
        this.out = [];
        this.error = [];
        this.delta = [];

        this.pesosAnterioresIncr = [];
        this.sesgosAnterioresIncr = [];
        
        this.momento = momento;
        
        
    }

    initPeso() {
        return Math.random() * (0.5 + 0.5) - 0.5;
    }

    initPesos() {
        for (let i = 0; i < this.n; i++) {
            this.pesos[i] = [];
            this.pesosAnterioresIncr[i]= [];
            for (let j = 0; j < this.m; j++) {
                this.pesos[i][j] = this.initPeso();   
                this.pesosAnterioresIncr[i][j]= 0;             
            }            
        }

        for (let j = 0; j < this.m; j++) {
            this.sesgos[j] = this.initPeso();
            this.sesgosAnterioresIncr[j] = 0;
        }
    }

    forward(inputs = []) {
        this.inputs = inputs;
        let pesosInputs = Mathjs.multiply(this.inputs, this.pesos);
        this.net = Mathjs.add(pesosInputs, this.sesgos);        
        for (let i = 0; i < this.net.length; i++) {
            this.out[i] = Activacion[this.activacion](this.net[i]);            
        }
        return this.out;
    }

    backward(error) {
        this.error = error;
        let trans = Mathjs.transpose(this.pesos);
        for (let i = 0; i < this.error.length; i++) {
            this.delta[i] = this.error[i] * Activacion[this.activacion](this.net[i], true);            
        }


        return Mathjs.multiply(this.delta, trans);
    }

    update(lr) {
        for (let k = 0; k < this.pesos.length; k++) {
            for (let j = 0; j < this.pesos[k].length; j++) {
                // this.pesos[k][j] 
                let input = this.inputs[k];
                let delta = this.delta[j] * input;
                //let delta = this.error[j] * Activacion[this.activacion](this.net[j], true) * input;  
                let incremento = delta * lr;
                incremento += this.momento * this.pesosAnterioresIncr[k][j];
                this.pesosAnterioresIncr[k][j] = incremento;              
                this.pesos[k][j] += incremento;
            }           
        }

        for (let k = 0; k < this.sesgos.length; k++) {
            //let delta = this.error[k] * Activacion[this.activacion](this.net[k], true);
            let delta = this.delta[k];
            let incremento = delta * lr;
            incremento += this.momento * this.sesgosAnterioresIncr[k];
            
           
            this.sesgosAnterioresIncr[k] = incremento;
            this.sesgos[k] += incremento;
        }
    }
    
   

    

}
module.exports = LayerDense;