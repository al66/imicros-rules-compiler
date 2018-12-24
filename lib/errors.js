/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 */
"use strict";

class ErrorCode {

    static get DIFFERENT_TYPE_EXPECTED() { return "001"; }
    static get UNKOWN_HITPOLICY() { return "002"; }
    static get UNEXPECTED_CHAR() { return "003"; }
    
    /*
    constructor (object) {
        Object.assign(this, object);
    }
    */
    
}

class SyntaxError extends Error {
    constructor( message, code, origin ) {
        super();
        Error.captureStackTrace(this, SyntaxError);
        this.name = "SyntaxError";
        this.code = code;
        this.message = message;
        if ( origin ) this.origin = origin;
    }
}

module.exports.SyntaxError = SyntaxError;
module.exports.ErrorCode = ErrorCode;