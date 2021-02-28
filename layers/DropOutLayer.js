class DropOutLayer {
    constructor(n = [], disableRate = 0.2) {
        this.n = n;
        this.disableRate = disableRate;
        this.eliminadas = {};
        this.m = n;
    }
    initPesos() {

    }
    update() {
        
    }
    getOutput() {
        for (let i = 0; i < this.n; i++) {  
            if(Math.random() < this.disableRate) {
                this.eliminadas[i] = 0;
            }else {
                this.eliminadas[i] = 1;
            }    
        }
    }
    forward(input = []) {
        this.getOutput();
        let salida = [];
        for (let i = 0; i < input.length; i++) {     
            salida[i] = this.eliminadas[i] * input[i];
        }
        return salida;
    }
    predict(input = []) {
        let salida = [];
        for (let i = 0; i < input.length; i++) {     
            salida[i] = this.disableRate * input[i];
        }
        return salida;
    }
    backward(error = []) {
        return error;
    }
}
module.exports = DropOutLayer;