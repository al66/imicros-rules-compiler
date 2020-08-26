/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 */
"use strict";


class Analyzer {

    constructor () {
        this.ast = null;
    }

    static analyze (ast) {
        return new Promise((resolve, reject) => {
            let analyzer = new Analyzer();
            analyzer._analyzeAst(ast).then(analyzer => {
                resolve(analyzer.ast);
            });
        });
    }

    _analyzeAst (ast) {
        return new Promise((resolve, reject) => {
            this.ast = ast;
            this._analyze(this.ast);
            resolve(this);
        });
    }
    
    
    _analyze (node) {
        /* istanbul ignore else */
        if (this["__"+node.node] && {}.toString.call(this["__"+node.node]) === "[object Function]") {
            //console.log(node)
            return this["__"+node.node](node);
        } else {
            throw new Error("Analyzer - missing function " + node.node);
        }
    }

    __RULESET (node) {
        node.rules.forEach(element => this._analyze(element));
        node.definitions.forEach(element => this._analyze(element));
        node.init.forEach(element => this._analyze(element));
    }
    __RULE (node) {
        this._analyze(node.when);
        this._analyze(node.then);
    }
    __THEN (node) {
        node.actions.forEach(element => this._analyze(element));
    }
    __ASSIGN (node) {
        node.var.assign = true;
        this._analyze(node.var);
        this._analyze(node.expression);
    }
    __WHEN (node) {
        this._analyze(node.condition);
    }
    __AND (node) {
        this._analyze(node.left);
        this._analyze(node.right);
    }
    __OR (node) {
        this._analyze(node.left);
        this._analyze(node.right);
    }
    __RELATION (node) {
        this._analyze(node.left);
        this._analyze(node.right);
    }
    __BINARY (node) {
        this._analyze(node.left);
        this._analyze(node.right);
    }
    __UNARY (node) {
        this._analyze(node.factor);
    }
    __NUMBER (node) {

    }
    __DATE (node) {
        
    }
    __TIME (node) {
        
    }
    __BOOL (node) {
        
    }
    __STRING (node) {
        
    }
    __NUMBER_TYPE (node) {
        
    }
    __DATE_TYPE (node) {
        
    }
    __TIME_TYPE (node) {
        
    }
    __STRING_TYPE (node) {
        
    }
    __BOOL_TYPE (node) {
        
    }
    __OBJECT_TYPE (node) {
        
    }
    __VAR (node) {
        node.type = this.ast.symbols.lookup(node.name) || {};
        if (node.assign || node.type.context == "output") node.output = true;
    }
    __DECLARATION (node) {
        this._analyze(node.var);
        this._analyze(node.type);
    }
    __TYPE (node) {
        
    }
    __FUNCTION (node) {
        
    }
    
}

module.exports = Analyzer;