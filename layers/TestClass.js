const Mathjs = require('mathjs');

class TestClass { 
    constructor() {
        this.testData = [];
        this.model = null;
    }

    loadData(testData) {
        this.testData = testData;
    }

    loadModel(model){
        this.model = model;
    }

    test(precision = false) {
        let suma = 0;
        let aciertos = 0;
        this.testData.forEach(element => {
            let result = this.model.predict(element.input);
            let target = element.output;
            let error = Mathjs.subtract(target, result);
            error.forEach(item => {
                suma += Math.abs(item);
            });

            if(precision) {
                let maxTarget = this.max(target); 
                let maxOut = this.max(result);
                if(maxOut['pos'] == maxTarget['pos']) {
                    aciertos++;
                } 
            }
        });

        let errorAbsolutoMedio = suma / this.testData.length;
        let precisionValue = null;
        if(precision) {
            precisionValue = aciertos / this.testData.length;
        }


        return {
            'absoluteError': errorAbsolutoMedio,
            'precision': precisionValue
        }           
    }

    max(arr) {
        let mx = 0;
        let pos = 0;
        for (let i = 0; i < arr.length; i++) {
            if(arr[i] > mx) {
                mx = arr[i];
                pos = i;
            } 
        }
        return {
            'max': mx,
            'pos': pos
        };
    }
}

module.exports = TestClass;