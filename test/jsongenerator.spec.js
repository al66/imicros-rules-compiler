"use strict";

const JsonGenerator = require("../lib/jsongenerator");
const Analyzer = require("../lib/analyzer");
const Symbols = require("../lib/symbols");
const Parser = require("../lib/parser");
// const Node = require("../lib/parser").Node;
const Lexer = require("../lib/lexer");
// const Token = require("../lib/lexer").Token;
// const util = require("util");

describe("Test Compiler - parse rule", () => {
    /*
    exp = "@@ ";
    exp += "~F user.groups.name[..string]; > result.acl[string]:= 'decline'; > result.rule[number]:= 0";
    exp += "@ user.groups.name :: 'admin','guests' => result.acl := 'allow'; result.rule := 1";
    exp += "@ user.groups.name :: 'others','members' => result.acl := 'allow'; result.rule := 2";
    exp += " @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        let e = exp;
        it("compiled function should return expected results", () => {
            //expect.assertions(10);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => {
                console.log(util.inspect(ast, false, null, true ));
                return JsonGenerator.build(ast);
            })
            .then(ruleset => {
                console.log(e);
                console.log(util.inspect(ruleset, false, null, true ));
            });
        });
    });
    exp = "@@ ";
    exp += "environment.date[date]; >date[date] := environment.date; result[string]:='false'";
    exp += "@ environment.date :: [2018-1-21..2018-2-23],>=2018-05-07 && user.name :: 'Fred','Max' & != 'Ernie'  => result := 'true'; rule:= 5";
    exp += " @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        let e = exp;
        it("compiled function should return expected results", () => {
            // expect.assertions(5);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => {
                console.log(util.inspect(ast, false, null, true ));
                return JsonGenerator.build(ast);
            })
            .then(ruleset => {
                console.log(e);
                console.log(util.inspect(ruleset, false, null, true ));
            });
        });
    });
    exp = "@@ ";
    exp += "environment.time[time]; >time[time] := environment.time; result[string]:='false'";
    exp += "@ environment.time :: [6:00..8:00],>14:00:30 => result := 'true'";
    exp += " @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        let e = exp;
        it("compiled function should return expected results", () => {
            // expect.assertions(4);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => {
                console.log(util.inspect(ast, false, null, true ));
                return JsonGenerator.build(ast);
            })
            .then(ruleset => {
                console.log(e);
                console.log(util.inspect(ruleset, false, null, true ));
            });
        });
    });
    */
    describe("Expression with input/output defintions", () => {
        let exp = "@@ ~C ";
        exp += "environment.date[..date] #Current date#; user.locale[string]:='en' #Locale#; count[number]:= 1+1; >date[date] := environment.date; > result[boolean]:=false; > env[object]:=environment;";
        exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00],>=2018-05-07 09:00 => result := true; rule:= 1 # rule one # ";
        exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00[,>=2018-05-07 09:00 & <= 2020-05-07 09:00 => result := user.confirmed(a) + 1 + 'yes'; rule:= 1 + 1  # rule two # ";
        exp += "@ user.locale :: 'de','es' => result := user.confirmed(a); rule:= 1 + 1  # rule two # ";
        exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00],>=2018-05-07 09:00 => result := false; rule:= 3 # rule three # ";
        exp += "@ user.name :: 'Max' => result := 'yes'; rule:= 4  # undefined var # ";
        exp += " @@";
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("compiled function should return expected results", () => {
            // expect.assertions(8);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => {
                // console.log(util.inspect(ast, false, null, true ));
                return JsonGenerator.build(ast);
            })
            .then(ruleset => {
                expect(ruleset).toBeDefined();
                expect(ruleset.input).toContainEqual({ label: "Current date", source: "environment.date", type: "date", array: true});
                expect(ruleset.input).toContainEqual({ label: "Locale", source: "user.locale", type: "string", array: false, default: "'en'"});
                expect(ruleset.input).toContainEqual({ label: "", source: "count", type: "number", array: false, default: "1 + 1"});
                expect(ruleset.output).toContainEqual({ label: "", destination: "date", type: "date", array: false});
                expect(ruleset.output).toContainEqual({ label: "", destination: "result", type: "boolean", array: false});
                // console.log(exp);
                // console.log(util.inspect(ruleset, false, null, true ));
            });
        });
    });
    describe("Expression without input/output defintions", () => {
        let exp = "@@ ";
        exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00],>=2018-05-07 09:00 => result := true; rule:= 1 # rule one # ";
        exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00[,>=2018-05-07 09:00 & <= 2020-05-07 09:00 => result := user.confirmed(a) + 1 + 'yes'; rule:= 1 + 1  # rule two # ";
        exp += "@ user.locale :: 'de','es' => result := user.confirmed(a); rule:= 1 + 1  # rule two # ";
        exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00],>=2018-05-07 09:00 => result := false; rule:= 3 # rule three # ";
        exp += "@ user.name :: 'Max'  && user.locale :: 'en' => result := 'yes'; rule:= 4  # undefined var # ";
        exp += " @@";
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("compiled function should return expected results", () => {
            // expect.assertions(8);
            return parser.parse(lexer).then(parser => Symbols.build(parser.ast()))
            .then(ast => Analyzer.analyze(ast))
            .then(ast => {
                // console.log(util.inspect(ast, false, null, true ));
                return JsonGenerator.build(ast);
            })
            .then(ruleset => {
                expect(ruleset).toBeDefined();
                expect(ruleset.input).toContainEqual({ label: "", source: "environment.date", type: "", array: false});
                expect(ruleset.input).toContainEqual({ label: "", source: "user.locale", type: "", array: false});
                expect(ruleset.input).toContainEqual({ label: "", source: "user.name", type: "", array: false});
                expect(ruleset.output).toContainEqual({ label: "", destination: "result", type: "", array: false});
                expect(ruleset.output).toContainEqual({ label: "", destination: "rule", type: "", array: false});
                // console.log(exp);
                // console.log(util.inspect(ruleset, false, null, true ));
            });
        });
    });
});