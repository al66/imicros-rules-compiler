/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 * @source https://github.com/pugjs/token-stream
 */
"use strict";

const matchToToken = require("./tokenizer").matchToToken;
const ifeel = require("./tokenizer").ifeel;

class Token {

    static get NAME() { return "name"; }
    static get STRING() { return "string"; }
    static get NUMBER() { return "number"; }
    static get IS() { return "::"; }
    static get ASSIGN() { return ":="; }
    static get THEN() { return "=>"; }
    static get OR() { return ","; }
    static get AND() { return "&"; }
    static get CONDITION_OR() { return "||"; }
    static get CONDITION_AND() { return "&&"; }
    static get SEMICOLON() { return ";"; }
    static get EOF() { return "eof"; }
    
    constructor (object) {
        Object.assign(this, object);

    }
    
}

class TokenStream {
    
    constructor (expression) {
        let tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(expression))) {
            tokens.push(token);
        }
        this._tokens = tokens;
        //this._current = 
    }

    getNextToken () {
        while (this._peek()) {
            let token = this._peek();
            // skip whitespaces
            if (token.type == "whitespace") { 
                this._advance(); 
                continue;
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
                return new Token({type: Token.NAME, value: name});
            }
            if (token.type == "string") {
                this._advance();
                return new Token({type: Token.STRING, value: token.value});
            }
            if (token.type == "number") {
                this._advance();
                return new Token({type: Token.NUMBER, value: token.value});
            }
            if (token.value == "::") {
                this._advance();
                return new Token({type: Token.IS, value: token.value});
            }
            if (token.value == ":=") {
                this._advance();
                return new Token({type: Token.ASSIGN, value: token.value});
            }
            if (token.value == "&&") {
                this._advance();
                return new Token({type: Token.CONDITION_AND, value: token.value});
            }
            if (token.value == "=>") {
                this._advance();
                return new Token({type: Token.THEN, value: token.value});
            }
            if (token.value == ";") {
                this._advance();
                return new Token({type: Token.SEMICOLON, value: token.value});
            }
            if (token.value == ",") {
                this._advance();
                return new Token({type: Token.OR, value: token.value});
            }
            if (token.value == "&") {
                this._advance();
                return new Token({type: Token.AND, value: token.value});
            }
            //ignore for the moment everything else
            this._advance();
        }
        return new Token({type: Token.EOF, value: null});
    }
        
    _lookahead (index) {
      if (this._tokens.length <= index) {
        return null;
        //throw new Error('Cannot read past the end of a stream');
      }
      return this._tokens[index];
    }
    
    _peek () {
      if (this._tokens.length === 0) {
        return null;
        //throw new Error('Cannot read past the end of a stream');
      }
      return this._tokens[0];
    }
    
    _advance () {
      if (this._tokens.length === 0) {
        return null;
        //throw new Error('Cannot read past the end of a stream');
      }
      return this._tokens.shift();
    }
    
    _defer (token) {
      this._tokens.unshift(token);
    }
    
}

module.exports = TokenStream;
module.exports.Token = Token;