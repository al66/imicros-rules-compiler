/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 */
"use strict";

// example expression: user.groups.name contains 'SAP Support' && ressource.status is 'published' && operation.type in ['read','write']
// example result: if (c.get('user.groups.name').indexOf('SAP Support') >= 0 && c.get('ressource.status') == 'published' && ['read','write'].indexOf(c.get('operation.type')) >= 0 ) {c.result = true }; c.count++; return c;

const Expression = require("./expression");

class Compiler {
    
    constructor() {
        this.maybe = [];
        this.stack = [];
    }
    
    compile(expression) {
        return new Promise((resolve, reject) => {
            let exp = new Expression('condition', expression);
            exp.compile().then((result) => {
                resolve(result);
            });
        });
    }
}

module.exports = new Compiler();