class Activacion {

    static lineal(net, derivada = false) {
        if(derivada) {
            return 1;
        }
        return net;
    }

    static escalon(net, derivada = false) {
        if(derivada) {
            return 1;
        }
        if(net < 0) {
            return 0;
        } else {
            return 1;
        }
    }

    static escalonv2(net, derivada = false) {
        if(derivada) {
            return 1;
        }
        if(net < 0) {
            return -1;
        } else {
            return 1;
        }
    }

    static sigmoide(net, derivada = false) {
        if(derivada) {
            return this.derivadaSigmoide(net);
        }
        return 1/(1+Math.pow(Math.E, -net));
    }

    static derivadaSigmoide(net) {
        let sigmoide = this.sigmoide(net);
        return sigmoide * (1 - sigmoide);
    }


    static sigmoideCross(net, derivada = false) {
        if(derivada) {
            return 1;
        }
        return 1/(1+Math.pow(Math.E, -net));
    }



    static tang(net, derivada = false) {
        if(derivada) {
            return this.derivadaTang(net);
        }
        return (Math.exp(net) - Math.exp(-net)) / (Math.exp(net) + Math.exp(-net));
    }

    static derivadaTang(net) {
        let tang = this.tang(net);
        return 1 - Math.pow(tang, 2);
    }

    static relu(net, derivada = false) {
        if(derivada) { 
            if(net < 0) {
                return 0;
            }           
            return 1;            
        } else {
            if(net < 0) {
                return 0;
            } else {
                return net;
            }
        }
    }  
    
}
module.exports = Activacion;