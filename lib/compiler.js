/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 */
"use strict";

const Lexer = require("./lexer");
const Parser = require("./parser");
const Codegenerator = require("./codegenerator");
const Analyzer = require("./analyzer");
const Symbols = require("./symbols");


class Compiler {

    static compile (ruleset) {
        return new Promise((resolve, reject) => {
            let lexer = new Lexer(ruleset)
            let parser = new Parser()
            parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => Codegenerator.build(ast))
            .then(ruleset => {
                resolve(ruleset.toString())
            })
            .catch(result => {
                reject(result)
            })
        })
    }

    static toFunction (strFunction) {
        return new Function("c", strFunction)
    }
    
}

module.exports = Compiler;
