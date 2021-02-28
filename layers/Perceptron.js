const Mathjs = require("mathjs");
const Activacion = require("./Activacion");
const fs = require('fs');

class Perceptron {
    constructor(activacion = 'lineal') {
        this.datosEntreno = [];
        this.pesos = [];
        this.sesgo = [];
        this.activacion = activacion;
    }

    loadTrainData(datosEntreno) {
        this.datosEntreno = datosEntreno;
    }

    initPeso() {
        return Math.random() * (0.5 + 0.5) - 0.5;
    }

    initPesos() {
        this.sesgo[0] = this.initPeso();
        let numeroEntradas = this.datosEntreno[0].input.length;

        for (let index = 0; index < numeroEntradas; index++) {
            this.pesos[index] = [];
            this.pesos[index][0] = this.initPeso();
        }
    }

    net(input = []) {
       let multi =  Mathjs.multiply(input, this.pesos);
       return Mathjs.add(multi, this.sesgo);
    }   
    
    out(net = []) {
        let out = [];
        for (let i = 0; i < net.length; i++) {
            out[i] = Activacion[this.activacion](net[i]);            
        }
        return out;
    }

    forward(input = []) {
        let net = this.net(input);
        return this.out(net);
    }

    error(outEsp, out) {
       return Mathjs.subtract(outEsp, out);
    }

    errorAbsoluto(error = []) {
        let errorAbsoluto = 0;
        for (let i = 0; i < error.length; i++) {
            errorAbsoluto += Math.abs(error[i]);            
        }
        return errorAbsoluto;
    }

    train(epocas, lr, debug = false) {
        let numDatos = this.datosEntreno.length;
        let registroErrores = [];
        for (let i = 0; i < epocas; i++) {
            let errorEpoca = 0;
            this.datosEntreno.forEach(element => {
                let input = element.input;
                let outEsp = element.output; 
                let net = this.net(input);
                let out = this.out(net);
                let error = this.error(outEsp, out);
                errorEpoca = errorEpoca + this.errorAbsoluto(error);
                this.correccionPesos(lr, error, input, net);
            });            
            let errorMedio = errorEpoca / numDatos;
            registroErrores.push(errorMedio);
            if(debug) {
                console.log("Epoca " + i + " " + errorMedio);
            }

            if(errorEpoca == 0) {
                break;
            }
            
        }
        return registroErrores;
    }

    correccionPesos(lr, error, input, net) {
        let activacion = Activacion[this.activacion](net[0], true);
        let numPeso = 0;
        // PESOS
        this.pesos.forEach(element => {
            let delta = error[0] * activacion * input[numPeso];
            let incremento = lr * delta;
            this.pesos[numPeso][0] += incremento;
            numPeso++;
        });

        // SESGO 
        let deltaSesgo = error[0] * activacion * 1;
        let incrementoSesgo = lr * deltaSesgo;
        this.sesgo[0] += incrementoSesgo;
    }

    save(file = 'perceptron.json') {
        let save = {
            'pesos': this.pesos,
            'sesgo': this.sesgo,
            'activacion': this.activacion
        };

        let data = JSON.stringify(save);
        fs.writeFileSync(file, data);
    }

    load(callback, file = 'perceptron.json') {
        fs.readFile(file, (err, data) => {
            if(err) throw err;

            let datos = JSON.parse(data);
            this.pesos = datos.pesos;
            this.sesgo = datos.sesgo;
            this.activacion = datos.activacion;
            callback();
        });
    }
    

}
module.exports = Perceptron;