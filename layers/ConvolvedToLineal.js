class ConvolvedToLineal {
    constructor(shapeEntrada = []) {
        this.shape = shapeEntrada;
        this.m = shapeEntrada[0] * shapeEntrada[1] * shapeEntrada[2];
    }
    initPesos() { }
    update() { }

    forward(input = []) {
        let salida = [];
        for (let mapa = 0; mapa < input.length; mapa++) {
            for (let i = 0; i < input[mapa].length; i++) {
                for (let j = 0; j < input[mapa][i].length; j++) {
                    salida.push(input[mapa][i][j]);
                }
            }
        }
        return salida; 
    }

    backward(error = []) {
        let mapas = this.shape[2];
        let width = this.shape[0];
        let height = this.shape[1]; 

        let count = 0;

        let salida = [];
        for (let mapa = 0; mapa < mapas; mapa++) {
            salida[mapa] = [];
            for (let x = 0; x < height; x++) {
                salida[mapa][x] = [];
                for (let y = 0; y < width; y++) {
                    salida[mapa][x][y] = error[count];
                    count++;
                }
            }
        }
        return salida;
    }

    
}
module.exports = ConvolvedToLineal;