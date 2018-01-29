/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 */
"use strict";

const matchToToken = require("./tokenizer").matchToToken;
const ifeel = require("./tokenizer").ifeel;
const TokenStream = require('./tokenstream');

class Expression {
 
    constructor (type, expression) {
        this.type = type;
        this.expression = expression;
        this.elements = [];
        this.result;
        this.operators = [
            'is',
            'between',
            'contains',
            'union',
            'intersect',
            'in',
            'and',
            'or'
        ];
    }

    toStream(expression) {
        let tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(expression))) {
            tokens.push(token);
        }
        //console.log("TOKENS:",JSON.stringify(tokens));
        return new TokenStream(tokens);
    }
    
    prepare() {
        return new Promise((resolve, reject) => {  
            let stream = this.toStream(this.expression);
            while(stream.peek()) {
                switch (stream.peek().type) {
                    case 'comparator': this.elements.push({ type: "comparator", value: stream.peek().value }); break;
                    case 'operator': this.elements.push({ type: "operator", value: stream.peek().value, sub: stream.peek().sub }); break;
                    case 'string': this.elements.push({ type: "string", value: stream.peek().value}); break;
                    case "punctuator": this.elements.push({ type: "punctuator", value: stream.peek().value}); break;
                    case 'name': {
                                    let element = { type: 'name' };
                                    element.value = stream.peek().value;
                                    while (stream.length() >= 2 ) {
                                        if (stream.lookahead(1).value == '.' && stream.lookahead(2).type == 'name') {
                                            stream.advance();
                                            element.value += stream.advance().value + stream.peek().value;
                                        } else {
                                            break;
                                        }
                                    }
                                    //filter operators
                                    if (this.operators.indexOf(element.value) >= 0) element.type = 'operator';
                                    this.elements.push(element);
                                }; break;
                    case "date": this.elements.push({ type: "date", value: stream.peek().value}); break;
                    case "number": this.elements.push({ type: "number", value: stream.peek().value}); break;
                    case "whitspace": break;
                };
                stream.advance();
            }
            resolve();
        });
    }
    
    build() {
        return new Promise((resolve, reject) => { 
            let stream = new TokenStream(this.elements);
            let term = {};
            while(stream.peek()) {
                switch (stream.peek().type) {
                    case "name": {
                        if (!term.left) {
                            // Start new term
                            term.left = stream.peek().value 
                        } else {
                            //reject(new Error("Invalid expression"));
                        }
                    }; break;
                    case "operator": {
                        if (!term.operator) {
                            term.operator = stream.peek().value;
                        } else {
                            //reject(new Error("Invalid expression"));
                        }
                    }; break;
                    case "string": {
                        // Close Term
                        let t = "c.compare(c.get('"+term.left+"'),"+stream.peek().value+")";
                        if (this.result) {
                            this.result += " && "+t;
                        } else {
                            this.result = t;
                        }
                    }
                }
                stream.advance();
            }
            resolve();
        });
    }
    
    
    
    compile() {
        return new Promise((resolve, reject) => {
            this.prepare().then(() => {
                console.log("ELEMENTS:",JSON.stringify(this.elements));
                this.build().then(() => {
                    this.result = "if("+this.result+")";
                    resolve(this.result);
                }).catch(error => {
                    reject(error);
                });
            })
            .catch(error => {
                console.log("ERR:", error);
            });
        });
    }
}

module.exports = Expression;
