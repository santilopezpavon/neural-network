const TestClass = require('./TestClass');
class StopEarly { 
    constructor(params = {}) {
        this.iterationInterval = 10;
        this.paciencia = 3;
        if(params.hasOwnProperty('iterationInterval')) {
            this.iterationInterval = params.iterationInterval;
        }
        if(params.hasOwnProperty('paciencia')) {
            this.paciencia = params.paciencia;
        }
        
        this.testClass = new TestClass();
        this.memoria = null;
        this.count = 0;
    }
    loadTestData(datosTest = []) {
        this.testClass.loadData(datosTest);
    }
    test(red, iteracion) {
        
        if(iteracion % this.iterationInterval == 0) {
           
            this.testClass.loadModel(red);   
            let resultado = this.testClass.test(true); 
            if(this.memoria != null) {
                if(resultado['absoluteError'] > this.memoria['absoluteError']) {
                    this.count++;
                    
                    if(this.count >= this.paciencia) {
                        return true;
                    }
                }
            }
            this.memoria = resultado;  
        }

        return false;
    }
}
module.exports = StopEarly;