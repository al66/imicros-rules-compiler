/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 * @source Ruslan's blog - Let's build a simple interpreter https://ruslanspivak.com/lsbasi-part7/ - excellent introduction
 *
 */
"use strict";


const TokenStream = require('./tokenstream');
const Token = require('./tokenstream').Token;
const Interpreter = require('./interpreter');
const Node = require('./interpreter').Node;


class Compiler {
    
    constructor (expression) {
        this.expression = null || expression;
        if (this.expression) this.stream = new TokenStream(this.expression);
        this.root = null;
        this.result = null;
        this.currentToken = this.stream.getNextToken();
    }

    eat (type) {
        //console.log("EATEN:", this.currentToken.value);
        if (this.currentToken.type == type) {
            this.currentToken = this.stream.getNextToken();
        } else {
            throw new Error ("Invalid Syntax");
        }
    }
    
    parseTerm () {
        // 
        // term : STRING | NAME | NUMBER
        //
    }
    
    parseExpression () {
        // 
        // expression : 
        //
        let node;
                
        let expression = "";
        while (this.currentToken.type != Token.EOF && this.currentToken.type != Token.SEMICOLON && this.currentToken.type != Token.CONDITION_AND && this.currentToken.type != Token.THEN && this.currentToken.type != Token.OR && this.currentToken.type != Token.AND) {
            expression += this.currentToken.value;
            this.eat(this.currentToken.type);
        }
        if (expression.length > 0) node = new Node({type: Node.EXPRESSION, expression: expression});
        
        return node;
    }
    
    /*
    parseTerm () {
        
    }
    */
    
    parseCondition () {
        // 
        // condition : NAME IS expression ( ( OR | AND ) expression)*
        // 
        //console.log("parseConditon:", this.currentToken.value);
        let name = "";
        if (this.currentToken.type == Token.NAME) {
            name = this.currentToken.value;
            this.eat(Token.NAME);
        }
        if (this.currentToken.type == Token.IS) {
            this.eat(Token.IS);
        }
        let node = new Node({type: Node.CONDITION, name: name, conditions: []});
        let condition = this.parseExpression();
        if (condition) node.conditions.push(condition);
        while (this.currentToken.type == Token.OR || this.currentToken.type == Token.AND) {
            this.eat(Token.OR);
            condition = this.parseExpression();
            if (condition) node.conditions.push(condition);
        }
        //console.log("parseConditon - Node",JSON.stringify(node));
        return node;
    }
    
    parseWhen () {
        //
        // when         : condition ( CONDITION_AND condition )* 
        //
        let node = new Node({type: Node.WHEN, conditions: []});
        let condition = this.parseCondition();
        if (condition) node.conditions.push(condition);
                
        while (this.currentToken.type == Token.CONDITION_AND ) {
            this.eat(Token.CONDITION_AND);
            condition = this.parseCondition();
            if (condition) node.conditions.push(condition);
        }
        return node;
    }
    
    parseAction () {
        //
        // action       : NAME ASSIGN expression
        //
        let name;
        if (this.currentToken.type == Token.NAME) {
            name = this.currentToken.value;
            this.eat(Token.NAME);
        }
        if (this.currentToken.type == Token.ASSIGN) {
            this.eat(Token.ASSIGN);
        }
        let node = new Node({type: Node.ASSIGN, name: name, expression: this.parseExpression()});
        
        return node;
    }
    
    parseThen () {
        //
        // then         : action ( SEMICOLON action )*
        //
        let node = new Node({type: Node.THEN, actions: []});
        
        let action = this.parseAction();
        if (action)  node.actions.push(action);
        
        while (this.currentToken.type == Token.SEMICOLON) {
            this.eat(this.currentToken.type);
            action = this.parseAction();
            if (action)  node.actions.push(action);
        }
        
        return node;
    }        
            
    parseRule () {
        //
        // rule         : when THEN then
        // when         : condition ( CONDITION_AND condition )* 
        // condition    : NAME IS expression
        // then         : action ( SEMICOLON action )*
        // action       : NAME ASSIGN expression
        //
        let node = this.parseWhen();
        if (this.currentToken.type == Token.THEN) {
            this.eat(Token.THEN);
        }
        node = new Node({type: Node.RULE, when: node, then: this.parseThen() });
        
        return this.root = node;
    }
    
    build () {
        console.log(JSON.stringify(this.root));
        this.result = Interpreter.build(this.root);
    }
    
    parse () {
        return new Promise((resolve, reject) => {

            if (!this.stream || !this.expression) reject(new Error("Missing expression"));
            //if (!this.stream.peek()) reject(new Error("Unvalid expression")) 
            
            try { 
                this.parseRule();
                this.build();
            } catch (error) {
                reject(error);
            }
            resolve(this.result);
            
        });
    }
     
}

module.exports = Compiler;