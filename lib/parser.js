/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 * @source Ruslan's blog - Let's build a simple interpreter https://ruslanspivak.com/lsbasi-part7/ - excellent introduction
 *
 */
"use strict";

const Token = require("./lexer").Token;
const SyntaxError = require("./errors").SyntaxError;
const ErrorCode = require("./errors").ErrorCode;

class Node {

    static get RULESET() { return "RULESET"; }
    static get RULE() { return "RULE"; }
    static get THEN() { return "THEN"; }
    static get ASSIGN() { return "ASSIGN"; }
    static get WHEN() { return "WHEN"; }
    static get AND() { return "AND"; }
    static get OR() { return "OR"; }
    static get RELATION_OP() { return "RELATION"; }
    static get BINARY_OP() { return "BINARY"; }
    static get UNARY_OP() { return "UNARY"; }
    static get NUMBER() { return "NUMBER"; }
    static get DATE() { return "DATE"; }
    static get TIME() { return "TIME"; }
    static get BOOL() { return "BOOL"; }
    static get STRING() { return "STRING"; }
    static get NUMBER_TYPE() { return "NUMBER_TYPE"; }
    static get DATE_TYPE() { return "DATE_TYPE"; }
    static get TIME_TYPE() { return "TIME_TYPE"; }
    static get STRING_TYPE() { return "STRING_TYPE"; }
    static get VAR() { return "VAR"; }
    static get DECLARATION() { return "DECLARATION"; }
    static get FUNCTION() { return "FUNCTION"; }
    
    constructor (object) {
        Object.assign(this, object);
    }
}


class Parser {
    
    constructor () {
        this.root = null;
    }

    _parseFunction (name) {
        // 
        // parameters     : expression ( COMMA expression )*
        // 
        let parameters = [];
        let parameter = this._parseExpression();
        if (parameter) parameters.push(parameter);
        while (this.lexer.current.type == Token.COMMA) {
            this.lexer.eat(Token.COMMA);
            parameter = this._parseExpression();
            if (parameter) parameters.push(parameter);
        }
        return new Node({node: Node.FUNCTION, name: name, parameters: parameters});
    }
    
    _parseVariable () {
        // 
        // variable     : VAR | FUNCTION PARENTHESIS_LEFT parameters PARENTHESIS_RIGHT
        // 
        let name = "";
        let node;
        if (this.lexer.current.type == Token.NAME) {
            name = this.lexer.current.value;
            this.lexer.eat(Token.NAME);
        }
        // function call
        if (this.lexer.current.type == Token.PARENTHESIS_LEFT) {
            this.lexer.eat(Token.PARENTHESIS_LEFT);
            node = this._parseFunction(name);
            this.lexer.eat(Token.PARENTHESIS_RIGHT);
        } else {
            node = new Node({node: Node.VAR, name: name});
        }
        return node;
    }
    
    _parseFactor () {
        // 
        // factor       : STRING | (PLUS | MINUS) factor | NUMBER | PARENTHESIS_LEFT expression PARENTHESIS_RIGHT | variable
        // 
        if (this.lexer.current.type == Token.PLUS) {
            let op = this.lexer.current.value;
            this.lexer.eat(Token.PLUS);
            return new Node({node: Node.UNARY_OP, operator: op, factor: this._parseFactor()});
        }
        if (this.lexer.current.type == Token.MINUS) {
            let op = this.lexer.current.value;
            this.lexer.eat(Token.MINUS);
            return new Node({node: Node.UNARY_OP, operator: op, factor: this._parseFactor()});
        }
        if (this.lexer.current.type == Token.PARENTHESIS_LEFT) {
            this.lexer.eat(Token.PARENTHESIS_LEFT);
            let node = this._parseExpression();
            this.lexer.eat(Token.PARENTHESIS_RIGHT);
            return node;
        }
        if (this.lexer.current.type == Token.STRING) {
            let type = new Node({node: Node.STRING_TYPE, array: false, buildIn: "String"});
            let node = new Node({node: Node.STRING, type: type, value: this.lexer.current.value});
            this.lexer.eat(Token.STRING);
            return node;
        }
        if (this.lexer.current.type == Token.DATE) {
            let type = new Node({node: Node.DATE_TYPE, array: false, buildIn: "Number"});
            let node = new Node({node: Node.DATE, type: type, value: this.lexer.current.value});
            this.lexer.eat(Token.DATE);
            return node;
        }
        if (this.lexer.current.type == Token.TIME) {
            let type = new Node({node: Node.TIME_TYPE, array: false, buildIn: "Number"});
            let node = new Node({node: Node.TIME, type: type, value: this.lexer.current.value});
            this.lexer.eat(Token.TIME);
            return node;
        }
        if (this.lexer.current.type == Token.NUMBER) {
            let type = new Node({node: Node.NUMBER_TYPE, array: false, buildIn: "Number"});
            let node = new Node({node: Node.NUMBER, type: type, value: this.lexer.current.value});
            this.lexer.eat(Token.NUMBER);
            return node;
        }
        if (this.lexer.current.type == Token.NAME) {
            return this._parseVariable();
        }
    }
    
    _parseTerm () {
        // 
        // term         : factor ((MULT | DIV) factor)*
        //
        let node = this._parseFactor();
        while (this.lexer.current.type == Token.MULT || this.lexer.current.type == Token.DIV) {
            let op = this.lexer.current.value;
            if (this.lexer.current.type == Token.MULT) {
                this.lexer.eat(Token.MULT);
            } else if (this.lexer.current.type == Token.DIV) {
                this.lexer.eat(Token.DIV);
            }
            node = new Node({node: Node.BINARY_OP, operator: op, left: node, right: this._parseFactor()});
        }
        return node;
    }
    
    _parseExpression () {
        // 
        // expression   : term ((PLUS | MINUS) term)*
        //
        let node = this._parseTerm();
        while (this.lexer.current.type == Token.PLUS || this.lexer.current.type == Token.MINUS) {
            let op = this.lexer.current.value;
            if (this.lexer.current.type == Token.PLUS) {
                this.lexer.eat(Token.PLUS);
            } else if (this.lexer.current.type == Token.MINUS) {
                this.lexer.eat(Token.MINUS);
            }
            node = new Node({node: Node.BINARY_OP, operator: op, left: node, right: this._parseTerm()});
        }
        return node;
    }
    
    _parseInterval (v) {
        //
        // interval     : BRACKET expression INTERVAL expression BRACKET
        //
        let op = "";
        if (this.lexer.current.type == Token.BRACKET_OPEN_LEFT) {
            op = ">";
            this.lexer.eat(Token.BRACKET_OPEN_LEFT);
        } else if (this.lexer.current.type == Token.BRACKET_OPEN_RIGHT) {
            op = ">=";
            this.lexer.eat(Token.BRACKET_OPEN_RIGHT);
        }
        let left = new Node({node: Node.RELATION_OP, left: v, operator: op, right: this._parseExpression()});
        this.lexer.eat(Token.INTERVAL);
        let exp = this._parseExpression();
        if (this.lexer.current.type == Token.BRACKET_OPEN_LEFT) {
            op = "<=";
            this.lexer.eat(Token.BRACKET_OPEN_LEFT);
        } else if (this.lexer.current.type == Token.BRACKET_OPEN_RIGHT) {
            op = "<";
            this.lexer.eat(Token.BRACKET_OPEN_RIGHT);
        }
        let right = new Node({node: Node.RELATION_OP, left: v, operator: op, right: exp});
        return new Node({node: Node.AND, left: left, right: right});
    }
    
    _parseRelation (v) {
        // 
        // relation     : OPERATOR expression | expression | interval
        // 
        let op = "==";
        let node = null;
        if (this.lexer.current.type == Token.LOGICAL_OPERATOR) {
            op = this.lexer.current.value;
            this.lexer.eat(Token.LOGICAL_OPERATOR);
            node = new Node({node: Node.RELATION_OP, left: v, operator: op, right: this._parseExpression()});
        } else if (this.lexer.current.type == Token.BRACKET_OPEN_LEFT || this.lexer.current.type == Token.BRACKET_OPEN_RIGHT) {
            node = this._parseInterval(v);
        } else {
            node = new Node({node: Node.RELATION_OP, left: v, operator: op, right: this._parseExpression()});
        }
        return node;
    }
    
    _parseCombination (v) {
        // 
        // combination  : relation ( AND relation )*
        // 
        let relation = this._parseRelation(v);
        while (this.lexer.current.type == Token.AND) {
            this.lexer.eat(Token.AND);
            relation = new Node({node: Node.AND, left: relation, right: this._parseRelation(v)});
        }
        return relation;
    }
    
    _parseCondition () {
        // 
        // condition    : variable IS combination ( OR combination )*
        // 
        let v;
        if (this.lexer.current.type == Token.NAME) {
            v = this._parseVariable();
            this.lexer.eat(Token.IS);
        }
        let combination = this._parseCombination(v);
        while (this.lexer.current.type == Token.OR) {
            this.lexer.eat(Token.OR);
            combination = new Node({node: Node.OR, left: combination, right: this._parseCombination(v)});
        }
        return combination;
    }
    
    _parseWhen () {
        //
        // when         : empty | condition ( CONDITION_AND condition )* 
        //
        if (this.lexer.current.type == Token.THEN) {
            return new Node({node: Node.WHEN, condition: new Node({node: Node.BOOL, value: true})});
        }
        let condition = this._parseCondition();
        while (this.lexer.current.type == Token.CONDITION_AND ) {
            this.lexer.eat(Token.CONDITION_AND);
            condition = new Node({node: Node.AND, left: condition, right: this._parseCondition()});
        }
        return new Node({node: Node.WHEN, condition: condition});
    }
    
    _parseAction () {
        //
        // action       : variable ASSIGN expression
        //
        let v;
        if (this.lexer.current.type == Token.NAME) {
            v = this._parseVariable();
            //name = this.lexer.current.value;
            //this.lexer.eat(Token.NAME);
        }
        if (this.lexer.current.type == Token.ASSIGN) {
            this.lexer.eat(Token.ASSIGN);
        }
        let node = new Node({node: Node.ASSIGN, var: v, expression: this._parseExpression()});
        
        return node;
    }
    
    _parseThen () {
        //
        // then         : action ( SEMICOLON action )*
        //
        let node = new Node({node: Node.THEN, actions: []});
        
        let action = this._parseAction();
        if (action)  node.actions.push(action);
        
        while (this.lexer.current.type == Token.SEMICOLON) {
            this.lexer.eat(this.lexer.current.type);
            action = this._parseAction();
            if (action)  node.actions.push(action);
        }
        
        return node;
    }        
    
    _parseType() {
        //
        // type            : (..)? string | number | date | time
        //
        let isArray = false;
        if (this.lexer.current.type == Token.INTERVAL) {
            isArray = true;
            this.lexer.eat(Token.INTERVAL);
        }
        if (this.lexer.current.type == Token.NAME) {
            if (this.lexer.current.value == "string") {
                this.lexer.eat(Token.NAME);
                return new Node({node: Node.STRING_TYPE, array: isArray, buildIn: "String"});
            }
            if (this.lexer.current.value == "number") {
                this.lexer.eat(Token.NAME);
                return new Node({node: Node.NUMBER_TYPE, array: isArray, buildIn: "Number"});
            }
            if (this.lexer.current.value == "date") {
                this.lexer.eat(Token.NAME);
                return new Node({node: Node.DATE_TYPE, array: isArray, buildIn: "Number"});
            }
            if (this.lexer.current.value == "time") {
                this.lexer.eat(Token.NAME);
                return new Node({node: Node.TIME_TYPE, array: isArray, buildIn: "Number"});
            }
        }
    }
    
    _parseDefinition () {
        //
        // definition      : ( > ) variable BRACKET_OPEN_RIGHT type BRACKET_OPEN_LEFT (ASSIGN expression)
        //
        let context = "input";
        if (this.lexer.current.type == Token.LOGICAL_OPERATOR) {
            if (this.lexer.current.value == ">") context = "output";
            this.lexer.eat(Token.LOGICAL_OPERATOR);
        }
        if (this.lexer.current.type == Token.NAME) {
            let v = this._parseVariable();
            this.lexer.eat(Token.BRACKET_OPEN_RIGHT);
            let t = this._parseType();
            this.lexer.eat(Token.BRACKET_OPEN_LEFT);
            this.root.definitions.push(new Node({node: Node.DECLARATION, context: context, var: v, type: t}));
            if (this.lexer.current.type == Token.ASSIGN) {
                this.lexer.eat(Token.ASSIGN);
                this.root.init.push(new Node({node: Node.ASSIGN, var: v, expression: this._parseExpression()}));
            }
        }
    }
    
    _parseHitpolicy () {
        //
        // hitpolicy      : HITPOLICY ( U | A | F | R | C+ | C< | C> | C# )
        //
        if (this.lexer.current.type == Token.HITPOLICY) {
            let policy = null;
            this.lexer.eat(Token.HITPOLICY);
            if (this.lexer.current.value == "U") {
                this.lexer.eat(Token.NAME);
                policy = "U";
            }
            if (this.lexer.current.value == "A") {
                this.lexer.eat(Token.NAME);
                policy = "A";
            }
            if (this.lexer.current.value == "F") {
                this.lexer.eat(Token.NAME);
                policy = "F";
            }
            if (this.lexer.current.value == "R") {
                this.lexer.eat(Token.NAME);
                policy = "R";
            }
            if (this.lexer.current.value == "C") {
                policy = "C";
                this.lexer.eat(Token.NAME);
                if (this.lexer.current.value == "+") {
                    this.lexer.eat(Token.PLUS);
                    policy = "C+";
                }
                if (this.lexer.current.value == "#") {
                    this.lexer.eat(Token.HASH);
                    policy = "C#";
                }
                if (this.lexer.current.value == "<") {
                    this.lexer.eat(Token.LOGICAL_OPERATOR);
                    policy = "C<";
                }
                if (this.lexer.current.value == ">") {
                    this.lexer.eat(Token.LOGICAL_OPERATOR);
                    policy = "C>";
                }
            }
            if (policy) {
                this.root.hitpolicy = policy;
            } else {
                let position = {expected: "U,A,F,R,C,C+,C<,C>,C#", found: this.lexer.current.value, match: this.lexer.current.match};
                throw new SyntaxError("Invalid Syntax - Unkown hit policy", ErrorCode.UNKOWN_HITPOLICY, position);
            }
        }
    }
    
    _parseContext () {
        //
        // context          : hitpolicy definition ( SEMICOLON definition )*
        //
        this._parseHitpolicy();
        this._parseDefinition();
        while (this.lexer.current.type == Token.SEMICOLON) {
            this.lexer.eat(Token.SEMICOLON);
            this._parseDefinition();
        }
    }

    _parseRule () {
        //
        // rule         : when THEN then
        // when         : condition ( CONDITION_AND condition )* 
        // condition    : variable IS combination ( OR combination )*
        // combination  : relation ( AND relation )*
        // relation     : OPERATOR factor | expression
        // then         : action ( SEMICOLON action )*
        // action       : variable ASSIGN expression
        // expression   : term ((PLUS | MINUS) term)*
        // term         : factor ((MULT | DIV) factor)*
        // factor       : STRING | (PLUS | MINUS) factor | NUMBER | 
        //                PARENTHESIS_LEFT expression PARENTHESIS_RIGHT | 
        //                FUNCTION PARENTHESIS_LEFT parameter PARENTHESIS_RIGHT |
        //                variable
        // variable     : VAR | FUNCTION PARENTHESIS_LEFT parameters PARENTHESIS_RIGHT
        // parameter    : expression ( COMMA expression )*
        //
        let node = this._parseWhen();
        if (this.lexer.current.type == Token.THEN) {
            this.lexer.eat(Token.THEN);
        }
        this.root.rules.push(new Node({node: Node.RULE, when: node, then: this._parseThen()}));
    }
    
    _parseRuleset () {
        //
        // @@ context ( @ rule )* @@
        //
        if (this.lexer.current.type == Token.RULESET) {
            this.lexer.eat(Token.RULESET);
            this._parseContext();
            while (this.lexer.current.type == Token.RULE) {
                if (this.lexer.current.type == Token.RULE) {
                    this.lexer.eat(Token.RULE);
                    this._parseRule();
                }
            }
            if (this.lexer.current.type == Token.RULESET) {
                this.lexer.eat(Token.RULESET);
            }
        }
    }
    
    ast() {
        return this.root;
    }
    
    parse (lexer) {
        return new Promise((resolve, reject) => {
            // 
            // ruleset
            //
            this.lexer = lexer;
            if (this.lexer.current.type == Token.RULESET) {
                if (!this.root) {
                    this.root = new Node({node: Node.RULESET, hitpolicy: "F", rules: [], definitions: [], init: [] });
                }
                this._parseRuleset();
            }
            /*
            if (!this.root) {
                this.root = new Node({node: Node.RULESET, hitpolicy: 'F', rules: [], definitions: [], init: [] });
            }
            while (this.lexer.current.type == Token.CONTEXT || this.lexer.current.type == Token.RULE) {
                if (this.lexer.current.type == Token.CONTEXT) {
                    this.lexer.eat(Token.CONTEXT);
                    this._parseContext();
                }
                if (this.lexer.current.type == Token.RULE) {
                    this.lexer.eat(Token.RULE);
                    this._parseRule();
                }
            }
            */
            if (this.lexer.current.type !== Token.EOF) {
                let position = {expected: "End of String", found: this.lexer.current.value, match: this.lexer.current.match};
                reject(new SyntaxError("Invalid syntax - no more characters after action list expected", ErrorCode.UNEXPECTED_CHAR, position ));
            }
            resolve(this);
        });
    }
    
}

module.exports = Parser;
module.exports.Node = Node;