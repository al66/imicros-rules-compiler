/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 * @source Ruslan's blog - Let's build a simple interpreter https://ruslanspivak.com/lsbasi-part7/ - excellent introduction
 * @source https://github.com/pugjs/token-stream
 *
 */
"use strict";

const matchToToken = require("./tokenizer").matchToToken;
const ifeel = require("./tokenizer").ifeel;
const SyntaxError = require("./errors").SyntaxError;
const ErrorCode = require("./errors").ErrorCode;
require("datejs");
//const Globalize = require( "globalize" );

class Token {

    /*
    static get RULESET_BEGIN() { return "RULESET_"; }
    static get RULESET_END() { return "_RULESET"; }
    */
    static get RULESET() { return "@@"; }
    static get RULE() { return "@"; }
    static get HITPOLICY() { return "~"; }
    static get NAME() { return "name"; }
    static get STRING() { return "string"; }
    static get NUMBER() { return "number"; }
    static get DATE() { return "date"; }
    static get TIME() { return "time"; }
    static get IS() { return "::"; }
    static get ASSIGN() { return ":="; }
    static get THEN() { return "=>"; }
    static get OR() { return ","; }
    static get COMMA() { return ","; }
    static get AND() { return "&"; }
    // static get CONDITION_OR() { return "||"; }
    static get CONDITION_AND() { return "&&"; }
    static get LOGICAL_OPERATOR() { return "logic"; }
    static get BRACKET_OPEN_LEFT() { return "["; }
    static get BRACKET_OPEN_RIGHT() { return "]"; }
    static get INTERVAL() { return ".."; }
    static get SEMICOLON() { return ";"; }
    static get PLUS() { return "+"; }
    static get MINUS() { return "-"; }
    static get MULT() { return "*"; }
    static get DIV() { return "/"; }
    static get PARENTHESIS_LEFT() { return "("; }
    static get PARENTHESIS_RIGHT() { return ")"; }
    static get EOF() { return "eof"; }
    
    constructor (object) {
        Object.assign(this, object);
    }
    
}

class Lexer {
    
    constructor (expression) {
        this.expression = null || expression;
        this._tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(expression))) {
            this._tokens.push(token);
        }
        this.currentToken = this._getNextToken();
    }
    
    get current() { 
        return this.currentToken 
    }
    
    eat (type) {
        if (this.currentToken.type == type) {
            this.currentToken = this._getNextToken();
        } else {
            let position = {expected: type, found: this.currentToken.type, match: this.currentToken.match};
            //console.log("SyntaxError:", JSON.stringify(position));
            throw new SyntaxError("Invalid Syntax", ErrorCode.DIFFERENT_TYPE_EXPECTED, position);
        }
    }

    _getNextToken () {
        while (this._peek()) {
            let token = this._peek();
            // skip whitespaces
            if (token.type == "whitespace") { 
                this._advance(); 
                continue;
            }
            if (token.value == "#") {
                this._advance();
                return new Token({type: Token.HASH, value: token.value, match: token});
            }
            if (token.value == "~") {
                this._advance();
                return new Token({type: Token.HITPOLICY, value: token.value, match: token});
            }
            if (token.value == "@@") {
                this._advance();
                return new Token({type: Token.RULESET, value: token.value, match: token});
            }
            if (token.value == "@") {
                this._advance();
                return new Token({type: Token.RULE, value: token.value, match: token});
            }
            if (token.type == "name") {
                let name = token.value;
                this._advance();
                while (this._tokens.length >= 2 ) {
                    if (this._peek().value == '.' && this._lookahead(1).type == 'name') {
                        this._advance();
                        name += "." + this._peek().value;
                        this._advance();
                    } else {
                        break;
                    }
                }
                /*
                // Key words
                if (name == Token.RULESET_BEGIN) {
                    return new Token({type: Token.RULESET_BEGIN, value: name, match: token});
                }
                if (name == Token.RULESET_END) {
                    return new Token({type: Token.RULESET_END, value: name, match: token});
                }
                */
                // Others
                return new Token({type: Token.NAME, value: name, match: token});
            }
            if (token.type == "string") {
                this._advance();
                return new Token({type: Token.STRING, value: token.value, match: token});
            }
            if (token.type == "number") {
                this._advance();
                return new Token({type: Token.NUMBER, value: Number(token.value), match: token});
            }
            if (token.type == "date") {
                this._advance();
                let date = token.value;
                // timestamp?
                if (this._peek().type == "whitespace" && this._lookahead(1).type == "time") {
                    this._advance();
                    date += " " + this._peek().value;
                    this._advance();
                }
                return new Token({type: Token.DATE, value: Date.parse(date), match: token});                
            }
            if (token.type == "time") {
                this._advance();
                let d = new Date(0)
                let t = Date.parse(token.value)
                t = new Date(d.getFullYear(),d.getMonth(),d.getDate(),t.getHours(),t.getMinutes(),t.getSeconds());
                return new Token({type: Token.TIME, value: t, match: token});                
            }
            if (token.value == "::") {
                this._advance();
                return new Token({type: Token.IS, value: token.value, match: token});
            }
            if (token.value == ":=") {
                this._advance();
                return new Token({type: Token.ASSIGN, value: token.value, match: token});
            }
            if (token.value == "&&") {
                this._advance();
                return new Token({type: Token.CONDITION_AND, value: token.value, match: token});
            }
            if (token.value == "=>") {
                this._advance();
                return new Token({type: Token.THEN, value: token.value, match: token});
            }
            if (token.value == ";") {
                this._advance();
                return new Token({type: Token.SEMICOLON, value: token.value, match: token});
            }
            if (token.value == ",") {
                this._advance();
                return new Token({type: Token.OR, value: token.value, match: token});
            }
            if (token.value == "&") {
                this._advance();
                return new Token({type: Token.AND, value: token.value, match: token});
            }
            if (token.value == ">" || token.value == "<" || token.value == ">=" || token.value == "<="  ) {
                this._advance();
                return new Token({type: Token.LOGICAL_OPERATOR, value: token.value, match: token});
            }
            if (token.value == "[") {
                this._advance();
                return new Token({type: Token.BRACKET_OPEN_RIGHT, value: token.value, match: token});
            }
            if (token.value == "]") {
                this._advance();
                return new Token({type: Token.BRACKET_OPEN_LEFT, value: token.value, match: token});
            }
            if (token.value == "..") {
                this._advance();
                return new Token({type: Token.INTERVAL, value: token.value, match: token});
            }
            if (token.value == "+") {
                this._advance();
                return new Token({type: Token.PLUS, value: token.value, match: token});
            }
            if (token.value == "-") {
                this._advance();
                return new Token({type: Token.MINUS, value: token.value, match: token});
            }
            if (token.value == "*") {
                this._advance();
                return new Token({type: Token.MULT, value: token.value, match: token});
            }
            if (token.value == "/") {
                this._advance();
                return new Token({type: Token.DIV, value: token.value, match: token});
            }
            if (token.value == "(") {
                this._advance();
                return new Token({type: Token.PARENTHESIS_LEFT, value: token.value, match: token});
            }
            if (token.value == ")") {
                this._advance();
                return new Token({type: Token.PARENTHESIS_RIGHT, value: token.value, match: token});
            }
            //ignore for the moment everything else
            this._advance();
        }
        return new Token({type: Token.EOF, value: null, match: null});
    }    
    
    _lookahead (index) {
      if (this._tokens.length <= index) {
        return null;
        // throw new Error('Cannot read past the end of a stream');
      }
      return this._tokens[index];
    }
    
    _peek () {
      if (this._tokens.length === 0) {
        return null;
        // throw new Error('Cannot read past the end of a stream');
      }
      return this._tokens[0];
    }
    
    _advance () {
      if (this._tokens.length === 0) {
        return null;
        // throw new Error('Cannot read past the end of a stream');
      }
      return this._tokens.shift();
    }
    
    /*
    _defer (token) {
      this._tokens.unshift(token);
    }
    */

}

module.exports = Lexer;
module.exports.Token = Token;