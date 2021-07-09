class CountVector {
    constructor() {
        this.data_train = [];
        this.data_train_cleaned = [];
        this.word_tokens = {};
        this.mapper_words = [];
    }

    /**
     * 
     * @param {*Array String} dataTrainStringArray 
     */
    setDataTrain(dataTrainStringArray) {
        this.data_train = dataTrainStringArray;
        this.data_train_cleaned = this.cleanArrayData(this.data_train)
    }

    cleanArrayData(dataToClean) {
        let dataCleaned = [];
        for (let i = 0; i < dataToClean.length; i++) {
            dataCleaned[i] = this.cleanDataString(dataToClean[i]);
        }
        return dataCleaned;
    }

    cleanDataString(text) {
        return text.toLowerCase()
            .replace(".", '')
            .replace(",", '')
            .replace("!", '')
            .replace("$", '')
            .replace("md", '')
            .trim()
            .replace(/ +(?= )/g, '');
    }

    dividirFrases() {

    }

    /**
     * Get all words of a phrase by groups of words.
     * @param {*} words 
     * @param {*} n 
     */
    generetaGroupWords(words, n = 1) {
        let newGrouped = [];
        let end = words.length - (n - 1);
        let value = n - 1;

        for (let i = 0; i < end; i++) {
            let stringWords = "";
            for (let j = 0; j < n; j++) {
                if (j !== 0) {
                    stringWords += " " + words[i + j]
                } else {
                    stringWords += words[i + j]
                }
            }
            newGrouped.push(stringWords);
        }
        return newGrouped;
    }
    // https://app.pluralsight.com/course-player?clipId=153efa41-b349-465b-8e8c-696149483540

    generateWordTokens(groups = [1]) {
        this.word_tokens = {};
        for (let i = 0; i < this.data_train_cleaned.length; i++) {
            const words = this.data_train_cleaned[i].split(" "); // Todas las palabras de un frase                       
            for (let j = 0; j < groups.length; j++) {
                let newGrouped = this.generetaGroupWords(words, groups[j]);
                for (let j = 0; j < newGrouped.length; j++) {
                    if (!this.word_tokens.hasOwnProperty(newGrouped[j])) {
                        const currentWordObject = {
                            "frecuencia": 1,
                            "documentsAppears": [],
                            "word": newGrouped[j],
                            "getNumberDocuments": function () {
                                return this.documentsAppears.length;
                            },
                        }
                        this.word_tokens[newGrouped[j]] = currentWordObject;
                        this.mapper_words.push(currentWordObject);

                    } else {
                        this.word_tokens[newGrouped[j]]["frecuencia"]++;
                    }
                }
            }
        }

        // Mapeo.
        this.mapper_words.sort(function (a, b)  {
            if (a.word < b.word) {
                return -1;
            }
            if (a.word > b.word) {
                return 1;
            }
            return 0;
        });

        return this.word_tokens;
    }

    generateMatrix(arrayFrases = null) {
        let data_analize = [];
        if (arrayFrases === null) {
            data_analize = this.data_train_cleaned
        } else {
            data_analize = this.cleanArrayData(arrayFrases)
        }

        let matrizFrecuencias = [];
        for (let i = 0; i < data_analize.length; i++) { // Iterar frase a frase
            const currentText = " " + data_analize[i] + " "; // Poner espacio delante y atrás
            matrizFrecuencias[i] = []; // Cada i es un documento.
            for (let j = 0; j < this.mapper_words.length; j++) { // Iterar todas las palabras por cada documento                
                const currentWord = " " + this.mapper_words[j].word + " "; // Palabra acual con espacio delante y atrás
                let count = (currentText.match(new RegExp(currentWord, "g")) || []).length;
                if (count != 0) {
                    this.mapper_words[j]["documentsAppears"].push(i); // Insertar el número de documento dónde aparece la palabra
                }
                matrizFrecuencias[i][j] = count;
            }
        }
        return matrizFrecuencias;      
    }

    calculateIdfPerWord() {
        let numDocuments = this.data_train_cleaned.length;
        for (let i = 0; i < this.mapper_words.length; i++) {
            this.mapper_words[i]["idf"] = Math.log((numDocuments + 1) / (this.mapper_words[i].getNumberDocuments() + 1)) + 1;            
        }
    }

    generateMatrixTf(matrizFrecuencias) {
        let matrixTf = [];
        let numDocuments = matrizFrecuencias.length;
        this.calculateIdfPerWord();
  
        for (let i = 0; i < matrizFrecuencias.length; i++) {
            const currentDocument = matrizFrecuencias[i]; // Linea referencia documento de la matriz de frecuencia.
            matrixTf[i] = [];

            // Sumar todas las frecuencias de las palabras del documento.
            let sum = 0;
            for (let j = 0; j < currentDocument.length; j++) {
                sum += currentDocument[j];
            }            

            for (let j = 0; j < currentDocument.length; j++) { // Recorrer palabra a palabra
                const tf = currentDocument[j] / sum;
                const idf = this.mapper_words[j].idf;
                matrixTf[i][j] = tf * idf;
            }
        }
        return matrixTf;
    }

    

}
module.exports = CountVector;