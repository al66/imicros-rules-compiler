"use strict";

const Symbols = require("../lib/symbols");
const Parser = require("../lib/parser");
const Node = require('../lib/parser').Node;
const Lexer = require("../lib/lexer");
const Token = require("../lib/lexer").Token;
const beautify = require('js-beautify').js_beautify

let exp = ""
describe("Test Symbols - build symbol table", () => {
    exp = "@@ ~U user.groups.name[..string] := 'Guests'; user.age[number]; user.id[string]; environment.date[date] := now(); environment.time[..time] @@"
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp)
        let parser = new Parser()
        it("should return expected function string", () => {
            expect.assertions(5);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => {    
                //console.log("SymbolTable:",JSON.stringify(ast.symbols));
                expect(ast.symbols.lookup('user.groups.name')).toEqual(expect.objectContaining({
                    node: Node.STRING_TYPE,
                    array: true,
                    buildIn: "String"
                }))
                expect(ast.symbols.lookup('user.age')).toEqual(expect.objectContaining({
                    node: Node.NUMBER_TYPE,
                    array: false,
                    buildIn: "Number"
                }))
                expect(ast.symbols.lookup('user.id')).toEqual(expect.objectContaining({
                    node: Node.STRING_TYPE,
                    array: false,
                    buildIn: "String"
                }))
                expect(ast.symbols.lookup('environment.date')).toEqual(expect.objectContaining({
                    node: Node.DATE_TYPE,
                    array: false,
                    buildIn: "Number"
                }))
                expect(ast.symbols.lookup('environment.time')).toEqual(expect.objectContaining({
                    node: Node.TIME_TYPE,
                    array: true,
                    buildIn: "Number"
                }))
            })
        })
    })
    exp = "@@ ~U user.groups.name[..string] := 'Guests'; user.age[number]; user.id[string]; user.groups.name[string]; environment.date[date] := now(); environment.time[..time] @@"
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp)
        let parser = new Parser()
        it("should throw error", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .catch(result => {    
                expect(result.name).toEqual("Error")
            })
        })
    })
})