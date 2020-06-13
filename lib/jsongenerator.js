/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 * @source Ruslan's blog - Let's build a simple interpreter https://ruslanspivak.com/lsbasi-part7/ - excellent introduction
 *
 */
"use strict";

// const Node = require("./parser").Node;
const Symbols = require("./symbols");
const Token = require("./lexer").Token;

class JsonGenerator {

    constructor (ast) {
        this.object = {};
        this.symbols = new Symbols;
    }

    static build (node) {
        return new Promise((resolve, reject) => {
            let generator = new JsonGenerator();
            generator.buildNode(node);
            resolve(generator.toObject());
        });
    }
    
    buildNode (node) {
        this.symbols = node.symbols || this.symbols;
        this._build(node);
    }

    _build (node, current) {
        /* istanbul ignore else */
        if (this["__"+node.node] && {}.toString.call(this["__"+node.node]) === "[object Function]") {
            return this["__"+node.node](node, current);
        } else {
            throw new Error("JsonGenerator - missing function " + node.node);
        }
    }
    
    __RULESET (node) {
        // RULESET rules
        this.object.hitpolicy = node.hitpolicy;
        this.object.input = [];
        this.object.output = [];
        // build input array
        node.definitions.forEach(element => {
            let col = {
                label: element.label,
                type: element.type ? this._build(element.type) : "",
                array: element.var && element.var.type ? !!element.var.type.array  : false
            };
            let name = element.var ? element.var.name : "";
            element.context === "output" ? col.destination = name : col.source = name;
            node.init.forEach(assign => {
                if (assign.var && assign.var.name === col.source) {
                    col.default = this._build(assign.expression);
                }
            });
            element.context === "output" ? this.object.output.push(col) : this.object.input.push(col);
        });
        // build rules array
        this.object.rules = [];
        node.rules.forEach(element => this._build(element, this.object));
        // add undefined input and output
        this.object.rules.forEach((rule) => {
            // add undefined var as input
            rule.conditions.forEach((cond) => {
                // already defined ?
                let input = this.object.input.find(input => input.source === cond.input);
                if (!input) {
                    this.object.input.push({
                        label: "",
                        source: cond.input,
                        type: "",
                        array: false
                    });
                }
            });
            // add undefined destinations as output
            rule.output.forEach((out) => {
                // already defined ?
                let output = this.object.output.find(output => output.destination === out.destination);
                if (!output) {
                    this.object.output.push({
                        label: "",
                        destination: out.destination,
                        type: "",
                        array: false
                    });
                }
            });
        });
        return;
    }
    
    __RULE (node, root) {
        // RULE when then
        let rule = {};
        this._build(node.when, rule);
        this._build(node.then, rule);
        rule.desc = node.desc;
        root.rules.push(rule);
    }
    
    __WHEN (node, rule) {
        // WHEN condition
        rule.conditions = [];
        this._build(node.condition, rule);
        return;
    }
    
    __AND (node, rule) {
        // AND left right
        let exp;
        if (node.interval) {
            let left = "";
            if (node.interval.left.inclusive) left = Token.BRACKET_OPEN_LEFT;
            if (node.interval.left.exclusive) left = Token.BRACKET_OPEN_RIGHT;
            let right = "";
            if (node.interval.right.inclusive) right = Token.BRACKET_OPEN_RIGHT;
            if (node.interval.right.exclusive) right = Token.BRACKET_OPEN_LEFT;
            exp = `${left}${this._build(node.left.right)}..${this._build(node.left.right)}${right}`;
        } else {
            exp = this._build(node.left)+" & "+this._build(node.right);
        }
        if (node.is) {
            let condition = {
                input: node.input.name,
                expression: exp
            };
            rule.conditions.push(condition);
            return;
        }
        return exp;
    }
    
    __OR (node, rule) {
        // OR left right
        let exp = this._build(node.left)+", "+this._build(node.right);
        if (node.is) {
            let condition = {
                input: node.input.name,
                expression: exp
            };
            rule.conditions.push(condition);
            return;
        }
        return exp;
    }
    
    __RELATION (node, rule) {
        // RELATION operator left right
        if (node.is) {
            let condition = {
                input: node.input.name,
                expression: this._build(node.right)
            };
            rule.conditions.push(condition);
            return;
        }
        let operator = node.operator === "==" ? "" : node.operator + " ";
        return (`${operator}${this._build(node.right)}`);
    }
    
    __THEN (node, rule) {
        // THEN actions
        rule.output = [];
        for (let key in node.actions) {
            this._build(node.actions[key], rule);
        }
        return;
    }
    
    __ASSIGN (node, rule) {
        // ASSIGN VAR expression
        // VAR name
        let assign = {
            destination: node.var.name,
            expression: this._build(node.expression) 
        };
        this._build(node.expression, assign);
        rule.output.push(assign);
        return;
    }

    __BOOL (node) {
        // BOOLEAN value
        return (node.value);
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
        return (node.str);
    }

    __TIME (node) {
        // TIME value
        return (node.str);
    }
    
    __VAR (node) {
        // VAR name
        return node.name;
    }
    
    __BINARY (node) {
        // BINARY_OP operator left right
        return (this._build(node.left)+" "+node.operator+" "+this._build(node.right));
    }
    
    __UNARY (node) {
        // UNARY_OP operator factor
        return (node.operator+this._build(node.factor));
    }
    __NUMBER_TYPE (node) {
        return node.buildIn;        
    }
    __DATE_TYPE (node) {
        return node.buildIn;        
    }
    __TIME_TYPE (node) {
        return node.buildIn;        
    }
    __STRING_TYPE (node) {
        return node.buildIn;        
    }
    __BOOL_TYPE (node) {
        return node.buildIn;        
    }
    __FUNCTION (node) {
        let func = node.name + "(";
        node.parameters.forEach((param,index) => index > 0 ? func += `,${param.name}` : func += param.name);
        func += ")";
        return func;
    }
    
    toObject () {
        return this.object;
    }
    
}

module.exports = JsonGenerator;
