class ConvolvedLayer{
    constructor(shape = [], kernelDimension = 3, kernelNum = 1) {
        this.kernelDimension = kernelDimension;        
        this.shape = shape;
        this.kernelNum = kernelNum;

        this.kernels = [];

        this.pasosHorizontales = null;
        this.pasosVerticales = null;
      

        this.m = this.getShapeOutput();

        this.sesgos = [];
    }

     getShapeOutput() {
        this.pasosHorizontales = this.shape[0] - this.kernelDimension + 1;
        this.pasosVerticales = this.shape[1] - this.kernelDimension + 1;
        return [
            this.pasosHorizontales,
            this.pasosVerticales,
            this.kernelNum
        ];
    }

    initPeso() {
        return Math.random() * (0.5 + 0.5) - 0.5;
    }

    initPesos() {
        let kernels = [];
        let canales = this.shape[2];
        for (let mapa = 0; mapa < this.kernelNum; mapa++) {
            kernels[mapa] = [];
            for (let canal = 0; canal < canales; canal++) {
                kernels[mapa][canal] = [];
                for (let x = 0; x < this.kernelDimension; x++) {
                    kernels[mapa][canal][x] = [];
                    for (let y = 0; y < this.kernelDimension; y++) {
                        kernels[mapa][canal][x][y] = this.initPeso();
                    } 
                }
            }
            this.sesgos[mapa] = this.initPeso(); 
        }
        this.kernels = kernels;
    }

    forward(input = []) {
        this.input = input;
        let mapas = [];
        for (let mapa = 0; mapa < this.kernelNum; mapa++) {
            mapas[mapa] = [];  
            for (let i = 0; i < this.pasosVerticales; i++) {
                mapas[mapa][i] = [];
                for (let j = 0; j < this.pasosHorizontales; j++) {
                    let neurona = this.calculoConvolucion(i, j, input, this.kernels[mapa]) + this.sesgos[mapa];
                    mapas[mapa][i][j] = neurona;                    
                }                
            }
        }
        return mapas;
    }

    calculoConvolucion(posVertical, posHorizontal, input, kernel) {
        let result = 0;
        let canales = this.shape[2]; 
        for (let canal = 0; canal < canales; canal++) {
            for (let i = 0; i < this.kernelDimension; i++) {
                for (let j = 0; j < this.kernelDimension; j++) {
                    result += kernel[canal][i][j] * input[canal][posVertical + i][posHorizontal + j]
                }
            }
        }
        return result;
    }

    backward(error = []) {
        this.error = error;
        let errorPropagado = [];
        let canales = this.shape[2];

        //let alturaError = error[0].length;
        // let anchuraError = error[0][0].length;

        for (let canal = 0; canal < canales; canal++) {
            errorPropagado[canal] = [];
           for (let j = 0; j < this.shape[1]; j++) {
            errorPropagado[canal][j] = [];
                for (let k = 0; k < this.shape[0]; k++) {
                    errorPropagado[canal][j][k] = 0; 
                }                           
           }                         
        }

        for (let mapa = 0; mapa < error.length; mapa++) {
            for (let x = 0; x < error[mapa].length; x++) { 
                for (let y = 0; y < error[mapa][x].length; y++) {
                    let currentError = error[mapa][x][y];
                    for (let canal = 0; canal < canales; canal++) {
                       for (let j = 0; j < this.kernelDimension; j++) {
                            for (let k = 0; k < this.kernelDimension; k++) {
                                errorPropagado[canal][x + j][y + k] += currentError * this.kernels[mapa][canal][j][k]; 
                            }                           
                       }                         
                    }
                }                
            }          
        }
        return errorPropagado;
    }


    update(lr) {
        let canales = this.shape[2];

        for (let mapa = 0; mapa < this.error.length; mapa++) {
            for (let x = 0; x < this.error[mapa].length; x++) {
                for (let y = 0; y < this.error[mapa][x].length; y++) {
                    let currentError = this.error[mapa][x][y];
                    this.sesgos[mapa] += currentError * lr ;
                    for (let canal = 0; canal < canales; canal++) {
                        for (let j = 0; j < this.kernelDimension; j++) {
                            for (let k = 0; k < this.kernelDimension; k++) {
                                this.kernels[mapa][canal][j][k] += currentError * lr * this.input[canal][x + j][y + k];
                            }                            
                        }
                    }                     
                }                
            }            
        }
    }
    


  
}

module.exports = ConvolvedLayer;