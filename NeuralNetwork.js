const LayerDense = require("./layers/LayerDense");
const SoftmaxLayer = require("./layers/SoftmaxLayer");
const Mathjs = require("mathjs");
const fs = require('fs');
const ConvolvedLayer = require('./layers/ConvolvedLayer');
const ConvolvedToLineal = require("./layers/ConvolvedToLineal");
const PoolingLayer = require("./layers/PoolingLayer"); 
const DropOutLayer = require("./layers/DropOutLayer"); 
const StopEarly = require('./layers/StopEarly');

class NeuralNetwork { 
    constructor(layers = [], numEntradas, options = {}) {
        this.layers = [];
        this.datosEntreno = [];
        this.layersparameter = layers;
        this.numEntradasparameter = numEntradas;
        this.reload(layers, numEntradas);   
        if(options.hasOwnProperty('stop')) {
            this.stopEarly = new StopEarly(options['stop']);
        } else {
            this.stopEarly = new StopEarly();
        }
        
        this.cargadoStopEarly = false;  
    }

    reload(layers, numEntradas) {
        let count = 0;
        layers.forEach(element => {
            let entradas = null;
            if(count == 0) {
                entradas = numEntradas;
            } else {
                entradas = this.layers[count - 1].m;
            }
            if(element.type == 'densed') {
                this.layers.push(new LayerDense(entradas, element.m, element.act, element.momento));
            } else if(element.type == 'softmax') {
                this.layers.push(new SoftmaxLayer(entradas, element.m, element.act, element.momento));
            } else if(element.type == 'convolved') { 
                this.layers.push(new ConvolvedLayer(entradas, 3, element.kernelNum));
            } else if(element.type == 'conversion') { 
                this.layers.push(new ConvolvedToLineal(entradas));
            } else if(element.type == 'pooling') { 
                this.layers.push(new PoolingLayer(entradas));
            } else if(element.type == 'drop') { // BORRAR
                this.layers.push(new DropOutLayer(entradas, element.rate));

            }
            count++;
        });
    }

    loadTrainData(datosEntreno = []) {
        this.datosEntreno = datosEntreno;
    }

    loadDatosStopEarly(datosTest = []) {
        this.stopEarly.loadTestData(datosTest);
        this.cargadoStopEarly = true;   
    }

    initPesos() {
        this.layers.forEach(element => {
            element.initPesos();
        });
    }  
    
    forward(input = []) {
        let x = input;
        this.layers.forEach(element => {
            x = element.forward(x);
        });
        
        return x;
    }    

    predict(input = []) {
        let x = input;
        this.layers.forEach(element => {
            if(typeof element.predict === 'function') {
                x = element.predict(x);
            } else {
                x = element.forward(x);
            }            
        });        
        return x;
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

    backward(error = []) {
        let posUltima = this.layers.length - 1;
        for(let i = posUltima; i>=0; i--) {
            error = this.layers[i].backward(error);
        }
    }

    update(lr) {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].update(lr);            
        }
    }

    train(epocas, lr, debug = false) {
        let numDatos = this.datosEntreno.length;
        let registroErrores = [];
        for (let i = 0; i < epocas; i++) {
            let errorEpoca = 0;
            this.datosEntreno.forEach(element => {
                let input = element.input;
                let outEsp = element.output;
                let out = this.forward(input);
                let error = this.error(outEsp, out);
                errorEpoca = errorEpoca + this.errorAbsoluto(error);
                this.backward(error);
                this.update(lr);
            });

            let errorMedio = errorEpoca / numDatos;
            registroErrores.push(errorMedio);
            if(debug) {
                console.log("Epoca " + i + " " + errorMedio);
            }


            if(this.cargadoStopEarly) {
                if(this.stopEarly.test(this, i)){
                    break;
                }
            }

            if(errorEpoca == 0) {
                break;
            }
        }
        return registroErrores; // NUEVO?
    }

    save(file = "neural-nerwork.json") {
        let save = {
            'layers': this.layers,
            'layersparameter': this.layersparameter,
            'numEntradasparameter': this.numEntradasparameter
        };
        let data = JSON.stringify(save);
        fs.writeFileSync(file, data);
    }

    load(callback, file = "neural-nerwork.json") {
        fs.readFile(file, (err, data) => {
            if (err) throw err;
            let datos = JSON.parse(data);
            this.reload(datos.layersparameter, datos.numEntradasparameter);
            for (let i = 0; i < this.layers.length; i++) {
                let currentLayer = this.layers[i];
                for (let prop in currentLayer) {
                    currentLayer[prop] = datos.layers[i][prop];
                }   
            }
            callback();
        });
    }
   

    
}
module.exports = NeuralNetwork;