class PoolingLayer {
    constructor(shapeEntrada = []) {
        this.shape = shapeEntrada;
        this.poolDim = 2;
        this.m = this.getOutputShape();   
        this.convertido = [];  
        this.coords = [];  
    }  
    getOutputShape() {
        let mapas = this.shape[2];
        let width = this.shape[0];
        let height = this.shape[1];

        let newWidth = Math.round(width / this.poolDim);
        let newHeight = Math.round(height / this.poolDim);

        return [newWidth, newHeight, mapas]; 
    }

    initPesos() {

    }
    update() {
        
    }
    forward(input = []) {
        let salidaShape = this.m;
        let convertido = [];
        let coords = [];
        for (let mapa = 0; mapa < salidaShape[2]; mapa++) {
            convertido[mapa] = [];
            coords[mapa] = [];
            for (let i = 0; i < salidaShape[1]; i++) {
                convertido[mapa][i] = [];
                coords[mapa][i] = [];
                for (let j = 0; j < salidaShape[0]; j++) { 
                    let poolResult = this.pooling(i, j, input[mapa]);
                    convertido[mapa][i][j] = poolResult['max'];
                    coords[mapa][i][j] = poolResult['coords'];
                }
            }
        }
        this.convertido = convertido;
        this.coords = coords;
        return convertido;
    }
    pooling(h, w, input) {
        let max = 0;
        let posHMapa = h * this.poolDim;
        let posWMapa = w * this.poolDim;
        let coords = {
            'h': posHMapa,
            'w': posWMapa
        };
        for (let i = 0; i < this.poolDim; i++) {
            for (let j = 0; j < this.poolDim; j++) {
                try {
                    let resultado = input[posHMapa + i][posWMapa + j]; 
                    if (typeof resultado !== 'undefined') {
                        if(resultado > max) {
                            max = resultado;
                            coords = {
                                'h': posHMapa + i,
                                'w': posWMapa + j
                            }
                        }
                    }
                } catch (error) {
                    
                }
            }
        }
        return {
            'max': max,
            'coords': coords
        };
    }
    backward(error = []) {
        let errorConvertido = [];
        for (let mapa = 0; mapa < this.shape[2]; mapa++) {
            errorConvertido[mapa] = [];
            for (let i = 0; i < this.shape[1]; i++) {
                errorConvertido[mapa][i] = [];
                for (let j = 0; j < this.shape[0]; j++) { 
                    errorConvertido[mapa][i][j] = 0;
                }  
            }              
        }

        for (let mapa = 0; mapa < this.m[2]; mapa++) {
            for (let i = 0; i < this.m[1]; i++) {
                for (let j = 0; j < this.m[0]; j++) {
                   // error[mapa][i][j]; 
                   let h = this.coords[mapa][i][j].h;
                    let w = this.coords[mapa][i][j].w;
                    errorConvertido[mapa][h][w] = error[mapa][i][j];
                }
            }
        }
        return errorConvertido;
    }
}
module.exports = PoolingLayer;