/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 */
"use strict";

class Context {
    
    constructor () {
        this.cache = [];
        this.result =  null;
        this.count =  0;
        this.error =  [];
    }
    
    get (name) {
        let result = null;
        if (this.cache[name]) {
            result = this.cache[name];
        } else {
            let param = this.param;
            if (param) {
                let token = name.split(".");
                for (var key in token) {
                    if (Array.isArray(param)) {
                        result = [];
                        for (var item in param) {
                            if (param[item].hasOwnProperty(token[key])) { 
                                result.push(param[item][token[key]]) 
                            }
                        }
                        param = result;
                    } else {
                        if (param.hasOwnProperty(token[key])) { 
                            result = param[token[key]]; 
                            param = result 
                        } else {
                            return null 
                        };
                    };
                }
            }
            this.cache[name] = result;
        }
        return result;
    }

    compare (a,b) {
        if ( Array.isArray(a) && !Array.isArray(b) ) {
            return (a.indexOf(b) >= 0);
        } else if ( !Array.isArray(a) && Array.isArray(b) ) {
            return (b.indexOf(a) >= 0);
        } else {
            return (a == b);
        }
    }     
}

module.exports = new Context();