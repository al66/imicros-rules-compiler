"use strict";

const Analyzer = require("../lib/analyzer");
const Symbols = require("../lib/symbols");
const Parser = require("../lib/parser");
const Node = require('../lib/parser').Node;
const Lexer = require("../lib/lexer");
const Token = require("../lib/lexer").Token;
const beautify = require('js-beautify').js_beautify

let exp = ""
describe("Test Compiler - parse rule", () => {
    exp = "@@ "
    exp += "~F user.groups.name[..string]; user.id[number]; > result.acl[string]:= 'decline'"
    exp += "@ user.groups.name :: 'admin','guests' && user.id :: 1000+ +10 => result.acl := 'allow'"
    exp += "@ user.groups.name :: 'others','members' => result.acl := 'allow'"
    exp += " @@"
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp)
        let parser = new Parser()
        it("variables and expressions should have correct type attributes", () => {
            expect.assertions(2);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => {
                // rule 2: user.groups.name -> array of string
                expect(ast.rules[1].when.condition.left.left.type).toEqual(expect.objectContaining({
                    node: Node.STRING_TYPE,
                    array: true
                }))
                // rule 1: result.acl -> string
                expect(ast.rules[0].then.actions[0].var.type).toEqual(expect.objectContaining({
                    node: Node.STRING_TYPE,
                    array: false
                }))
            })
        })
    })
})