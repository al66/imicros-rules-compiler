"use strict";

const Codegenerator = require("../lib/codegenerator");
const Analyzer = require("../lib/analyzer");
const Symbols = require("../lib/symbols");
const Parser = require("../lib/parser");
const Node = require("../lib/parser").Node;
const Lexer = require("../lib/lexer");
const Token = require("../lib/lexer").Token;
const beautify = require("js-beautify").js_beautify;

let exp = "";
describe("Test Compiler - parse rule", () => {
    exp = "@@ ";
    exp += "~F user.groups.name[..string]; > result.acl[string]:= 'decline'; > result.rule[number]:= 0";
    exp += "@ user.groups.name :: 'admin','guests' => result.acl := 'allow'; result.rule := 1";
    exp += "@ user.groups.name :: 'others','members' => result.acl := 'allow'; result.rule := 2";
    exp += " @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("compiled function should return expected results", () => {
            expect.assertions(10);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => Codegenerator.build(ast))
            .then(ruleset => {
                //console.log(beautify(ruleset.toString(), { indent_size: 2, wrap_line_length: 80 }));
                let f = ruleset.getFunction();
                let response = f({user: { groups: { name: ["users"] } }});
                //console.log(response)
                expect(response.result.acl).toEqual("decline");
                expect(response.result.rule).toEqual(0);
                response = f({user: { groups: { name: ["admin"] } }, result: {acl: "undefined"}});
                expect(response.result.acl).toEqual("allow");
                expect(response.result.rule).toEqual(1);
                response = f({user: { groups: { name: ["guests","users"] } }, result: {acl: "undefined"}});
                expect(response.result.acl).toEqual("allow");
                expect(response.result.rule).toEqual(1);
                response = f({user: { groups: { name: ["members","users"] } }, result: {acl: "undefined"}});
                expect(response.result.acl).toEqual("allow");
                expect(response.result.rule).toEqual(2);
                response = f({user: { groups: { name: "members" } }, result: {acl: "undefined"}});
                expect(response.result.acl).toEqual("allow");
                expect(response.result.rule).toEqual(2);
            });
        });
    });
    exp = "@@ ";
    exp += "environment.date[date]; >date[date] := environment.date; result[string]:='false'";
    exp += "@ environment.date :: [2018-1-21..2018-2-23],>=2018-05-07 => result := 'true'; rule:= 5";
    exp += " @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("compiled function should return expected results", () => {
            expect.assertions(5);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => Codegenerator.build(ast))
            .then(ruleset => {
                //console.log(beautify(ruleset.toString(), { indent_size: 2, wrap_line_length: 80 }));
                let f = ruleset.getFunction();
                let response = f({environment: {date: "2018-1-21"}});
                //console.log(response)
                expect(response.result).toEqual("true");
                expect(response.rule).toEqual(5);
                response = f({environment: {date: "2018-1-20"}});
                //console.log(response)
                expect(response.result).toEqual("false");
                response = f({environment: {date: "2018-05-07"}});
                //console.log(response)
                expect(response.result).toEqual("true");
                expect(response.rule).toEqual(5);
            });
            /*
            .catch(err => {
                console.log(err)
                if (err.position) console.log(err.position)
            })
            */
        });
    });
    exp = "@@ ";
    exp += "environment.time[time]; >time[time] := environment.time; result[string]:='false'";
    exp += "@ environment.time :: [6:00..8:00],>14:00:30 => result := 'true'";
    exp += " @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("compiled function should return expected results", () => {
            expect.assertions(4);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => Codegenerator.build(ast))
            .then(ruleset => {
                //console.log(beautify(ruleset.toString(), { indent_size: 2, wrap_line_length: 80 }));
                let f = ruleset.getFunction();
                let response = f({environment: {time: "06:00:00"}});
                //console.log(response)
                expect(response.result).toEqual("true");
                response = f({environment: {time: "09:00:00"}});
                //console.log(response)
                expect(response.result).toEqual("false");
                response = f({environment: {time: "14:00:30"}});
                //console.log(response)
                expect(response.result).toEqual("false");
                response = f({environment: {time: "14:00:31"}});
                //console.log(response)
                expect(response.result).toEqual("true");
            });
            /*
            .catch(err => {
                console.log("ERROR:",err)
                if (err.position) console.log(err.position)
            })
            */
        });
    });
    exp = "@@ ";
    exp += "environment.date[date]; >date[date] := environment.date; result[string]:='false'";
    exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00],>=2018-05-07 09:00 => result := 'true'; rule:= 5";
    exp += " @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("compiled function should return expected results", () => {
            expect.assertions(8);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => Codegenerator.build(ast))
            .then(ruleset => {
                //console.log(beautify(ruleset.toString(), { indent_size: 2, wrap_line_length: 80 }));
                let f = ruleset.getFunction();
                let response = f({environment: {date: "2018-1-21 06:00"}});
                //console.log(response)
                expect(response.result).toEqual("true");
                expect(response.rule).toEqual(5);
                response = f({environment: {date: "2018-1-21 05:00"}});
                //console.log(response)
                expect(response.result).toEqual("false");
                response = f({environment: {date: "2018-1-22 05:00"}});
                //console.log(response)
                expect(response.result).toEqual("true");
                response = f({environment: {date: "2018-2-23 08:00"}});
                //console.log(response)
                expect(response.result).toEqual("true");
                response = f({environment: {date: "2018-2-23 08:00:01"}});
                //console.log(response);
                expect(response.result).toEqual("false");
                response = f({environment: {date: "2018-05-07 23:00"}});
                //console.log(response)
                expect(response.result).toEqual("true");
                expect(response.rule).toEqual(5);
            });
            /*
            .catch(err => {
                console.log(err)
                if (err.position) console.log(err.position)
            })
            */
        });
    });
});