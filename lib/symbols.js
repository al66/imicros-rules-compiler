/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 */
"use strict";


class Symbols {

    constructor () {
        this.symbolTable = {};
    }

    add (name, type, context) {
        type.context = context;
        this.symbolTable["'"+name+"'"] = type;
    }
    
    lookup (name) {
        return (this.symbolTable["'"+name+"'"] || null);
    }

    static build (ast) {
        return new Promise((resolve, reject) => {
            ast.symbols = new Symbols();
            ast.symbols._analyzeAst(ast).then(symbols => {
                resolve(ast);
            })
            .catch(err => reject(err));
        });
    }

    _analyzeAst (ast) {
        return new Promise((resolve, reject) => {
            this._analyze(ast);
            resolve(this);
        });
    }
    
    
    _analyze (node) {
        /* istanbul ignore else */
        if (this["__"+node.node] && {}.toString.call(this["__"+node.node]) === "[object Function]") {
            return this["__"+node.node](node);
        } else {
            throw new Error("Symbols - missing function " + node.node);
        }
    }

    __RULESET (node) {
        //node.rules.forEach(element => this._analyze(element));
        node.definitions.forEach(element => this._analyze(element));
        //node.init.forEach(element => this._analyze(element));
    }
    __DECLARATION (node) {
        //this._analyze(node.var);
        //this._analyze(node.type);
        if (this.lookup(node.var.name)) throw new Error ("Symbols - dublicate declaration of "+node.var.name);
        this.add(node.var.name,node.type, node.context);
    }
}

module.exports = Symbols;