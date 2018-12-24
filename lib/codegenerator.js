/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 * @source Ruslan's blog - Let's build a simple interpreter https://ruslanspivak.com/lsbasi-part7/ - excellent introduction
 *
 */
"use strict";

const Node = require("./parser").Node;
const globals = require("./globals");
const Symbols = require("./symbols");

class Codegenerator {

    constructor (ast) {
        this.strFunction = "";
        this.symbols = new Symbols;
    }

    static build (node) {
        return new Promise((resolve, reject) => {
            let generator = new Codegenerator();
            generator.buildNode(node);
            resolve(generator);
        });
    }
    
    buildNode (node) {
        this.symbols = node.symbols || this.symbols;
        this.strFunction = this._build(node);
    }

    _build (node) {
        /* istanbul ignore else */
        if (this["__"+node.node] && {}.toString.call(this["__"+node.node]) === "[object Function]") {
            return this["__"+node.node](node);
        } else {
            throw new Error("Compiler - missing function " + node.node);
        }
    }
    
    __RULESET (node) {
        // RULESET rules
        let s = globals;
        node.init.forEach(element => { s += this._build(element) + ";";});
        node.rules.forEach(element => { s += this._build(element);});
        return (s += ";return r");
    }
    
    __RULE (node) {
        // RULE when then
        return (this._build(node.when)+"{"+this._build(node.then)+";return r}");
    }
    
    __WHEN (node) {
        // WHEN condition
        let condition = this._build(node.condition) || "true";
        return ("if("+condition+")");
    }
    
    __AND (node) {
        // AND left right
        return ("("+this._build(node.left)+" && "+this._build(node.right)+")");
    }
    
    __OR (node) {
        // OR left right
        return ("("+this._build(node.left)+" || "+this._build(node.right)+")");
    }
    
    __THEN (node) {
        // THEN actions
        let list = "";
        for (let key in node.actions) {
            list += this._build(node.actions[key]) + ";";
        }
        return list;
    }
    
    __ASSIGN (node) {
        // ASSIGN VAR expression
        // VAR name
        let context = "c";
        if (node.var.output) context = "r";
        return ("setToValue("+context+",'" + node.var.name + "',"+ this._build(node.expression) +")");
    }

    __RELATION (node) {
        // RELATION operator left right
        //if (node.right.node == Node.DATE ) {
        if (node.left.type.node == Node.DATE_TYPE ) {
            return ("(new Date("+this._build(node.left)+").getTime() "+node.operator+" "+this._build(node.right)+")");
        //} else if (node.right.node == Node.TIME) {
        } else if (node.left.type.node == Node.TIME_TYPE) {
            return ("(getTime("+this._build(node.left)+") "+node.operator+" "+this._build(node.right)+")");
        } else {
            if (node.left.type.array) {
                return ("("+this._build(node.left)+".some(element => { return element "+node.operator+" "+this._build(node.right)+"}))");
            } else {
                return ("("+this._build(node.left)+" "+node.operator+" "+this._build(node.right)+")");   
            }
        }
    }
    
    __STRING (node) {
        // STRING value
        return (node.value);
    }
    
    __NUMBER (node) {
        // NUMBER value
        return (node.value);
    }
    
    __DATE (node) {
        // DATE value
        return (node.value.getTime());
    }

    __TIME (node) {
        // TIME value
        return (node.value.getTime());
    }
    
    __VAR (node) {
        // VAR name
        let isArray = true;
        if (node.type) {
            if (!node.type.array) isArray = false;
        }
        return ("getValue(c,'" + node.name + "',"+isArray+")");
    }
    
    __BINARY (node) {
        // BINARY_OP operator left right
        return ("("+this._build(node.left)+" "+node.operator+" "+this._build(node.right)+")");
    }
    
    __UNARY (node) {
        // UNARY_OP operator factor
        return (node.operator+this._build(node.factor));
    }
    
    toString () {
        let f = new Function("c", this.strFunction);
        return "{ return " + f.toString() + "}";
    }
    
    getFunction () {
        return new Function("c", this.strFunction);
    }
    
    static toFunction (strFunction) {
        return new Function("c", strFunction);
    }
    
}

module.exports = Codegenerator;
