"use strict";

const Parser = require("../lib/parser");
const Node = require("../lib/parser").Node;
const Lexer = require("../lib/lexer");
const Token = require("../lib/lexer").Token;

let exp = "";
describe("Test Parser - parse context", () => {
    exp = "@@ ~U user.groups.name[..string] := 'Guests'; user.age[number]; user.id[string]; environment.date[date] := now() @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(19);
            return parser.parse(lexer).then(parser => {
                //console.log(JSON.stringify(parser.ast()))
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("U");
                expect(result.definitions[0]).toEqual(expect.objectContaining({
                    node: Node.DECLARATION
                }));
                expect(result.definitions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.groups.name"
                }));
                expect(result.definitions[0].type).toEqual(expect.objectContaining({
                    node: Node.STRING_TYPE,
                    array: true,
                    buildIn: "string"
                }));
                expect(result.definitions[1]).toEqual(expect.objectContaining({
                    node: Node.DECLARATION
                }));
                expect(result.definitions[1].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.age"
                }));
                expect(result.definitions[1].type).toEqual(expect.objectContaining({
                    node: Node.NUMBER_TYPE,
                    array: false,
                    buildIn: "number"
                }));
                expect(result.definitions[2]).toEqual(expect.objectContaining({
                    node: Node.DECLARATION
                }));
                expect(result.definitions[2].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.id"
                }));
                expect(result.definitions[2].type).toEqual(expect.objectContaining({
                    node: Node.STRING_TYPE,
                    array: false,
                    buildIn: "string"
                }));
                expect(result.definitions[3]).toEqual(expect.objectContaining({
                    node: Node.DECLARATION
                }));
                expect(result.definitions[3].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.date"
                }));
                expect(result.definitions[3].type).toEqual(expect.objectContaining({
                    node: Node.DATE_TYPE,
                    array: false,
                    buildIn: "date"
                }));
                expect(result.init[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.init[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.groups.name"
                }));
                expect(result.init[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'Guests'"
                }));
                expect(result.init[1]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.init[1].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.date"
                }));
                expect(result.init[1].expression).toEqual(expect.objectContaining({
                    node: Node.FUNCTION,
                    name: "now"
                }));
            });
        });
    });
    exp = "@@ ~U @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should be parsed with hitpolicy U", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("U");
            });
        });
    });
    exp = "@@ ~A @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should be parsed with hitpolicy A", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("A");
            });
        });
    });
    exp = "@@ ~F @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should be parsed with hitpolicy F", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("F");
            });
        });
    });
    exp = "@@ ~R @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should be parsed with hitpolicy R", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("R");
            });
        });
    });
    exp = "@@ ~C @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should be parsed with hitpolicy C", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("C");
            });
        });
    });
    exp = "@@ ~C+ @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should be parsed with hitpolicy C+", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("C+");
            });
        });
    });
    exp = "@@ ~C# @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should be parsed with hitpolicy C#", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("C#");
            });
        });
    });
    exp = "@@ ~C< @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should be parsed with hitpolicy C<", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("C<");
            });
        });
    });
    exp = "@@ ~C> @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should be parsed with hitpolicy C>", () => {
            expect.assertions(1);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast();
                expect (result.hitpolicy).toEqual("C>");
            });
        });
    });
    exp = "@@ ~S @@";
    describe("Exceptions - Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should throw SyntaxError", () => {
            expect.assertions(4);
            return parser.parse(lexer).catch(result => {
                expect(result.name).toEqual("SyntaxError");
                expect(result.code).toEqual("002");
                expect(result.data).toEqual(expect.objectContaining({
                    expected: "U,A,F,R,C,C+,C<,C>,C#",
                    found: "S"
                }));
                expect(result.data.match).toEqual(expect.objectContaining({
                    value: "S",
                    index: 4
                }));
            });
        });
    });
});
describe("Test Parser - parse rule", () => {
    exp = "@@ ~A user.groups.name[..string]; name.default[string]:= 'Unknown' @ user.groups.name :: 'group:1' => result.acl := 'allow' @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(9);
            return parser.parse(lexer).then(parser => {
                //console.log(JSON.stringify(parser.ast()))
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "=="
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.groups.name"
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'group:1'"
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result.acl"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'allow'"
                }));
            });
        });
    });
    exp = "@@ @ => result.sum := 5 + 2 @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(7);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result.sum"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.BINARY_OP,
                    operator: "+"
                }));
                expect(result.then.actions[0].expression.left).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 5
                }));
                expect(result.then.actions[0].expression.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 2
                }));
            });
        });
    });
    exp = "@@ @ => result.sum := -5 + 2 @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(8);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result.sum"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.BINARY_OP,
                    operator: "+"
                }));
                expect(result.then.actions[0].expression.left).toEqual(expect.objectContaining({
                    node: Node.UNARY_OP,
                    operator: "-"
                }));
                expect(result.then.actions[0].expression.left.factor).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 5
                }));
                expect(result.then.actions[0].expression.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 2
                }));
            });
        });
    });
    exp = "@@ @ user.age :: >= 16 & <= +35, >60+7-x => result := true @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(22);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.OR
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">"
                }));
                expect(result.when.condition.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.age"
                }));
                expect(result.when.condition.right.right).toEqual(expect.objectContaining({
                    node: Node.BINARY_OP,
                    operator: "-"
                }));
                expect(result.when.condition.right.right.left).toEqual(expect.objectContaining({
                    node: Node.BINARY_OP,
                    operator: "+"
                }));
                expect(result.when.condition.right.right.left.left).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 60
                }));
                expect(result.when.condition.right.right.left.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 7
                }));
                expect(result.when.condition.right.right.right).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "x"
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.AND
                }));
                expect(result.when.condition.left.left).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">="
                }));
                expect(result.when.condition.left.left.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.age"
                }));
                expect(result.when.condition.left.left.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 16
                }));
                expect(result.when.condition.left.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "<="
                }));
                expect(result.when.condition.left.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.age"
                }));
                expect(result.when.condition.left.right.right).toEqual(expect.objectContaining({
                    node: Node.UNARY_OP,
                    operator: "+"
                }));
                expect(result.when.condition.left.right.right.factor).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 35
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.BOOL,
                    value: true
                }));
            });
        });
    });
    exp = "@@ @ environment.date :: [2018-1-21..2018-2-23],>=2018-05-07 => result := 'true'; rule:= 5 @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(20);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.OR
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.AND
                }));
                expect(result.when.condition.left.left).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">="
                }));
                expect(result.when.condition.left.left.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.date"
                }));
                expect(result.when.condition.left.left.right).toEqual(expect.objectContaining({
                    node: Node.DATE,
                    value: new Date(2018,0,21)
                }));
                expect(result.when.condition.left.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "<="
                }));
                expect(result.when.condition.left.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.date"
                }));
                expect(result.when.condition.left.right.right).toEqual(expect.objectContaining({
                    node: Node.DATE,
                    value: new Date(2018,1,23)
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">="
                }));
                expect(result.when.condition.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.date"
                }));
                expect(result.when.condition.right.right).toEqual(expect.objectContaining({
                    node: Node.DATE,
                    value: new Date(2018,4,7)
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'true'"
                }));
                expect(result.then.actions[1]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[1].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "rule"
                }));
                expect(result.then.actions[1].expression).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 5
                }));
            });
        });
    });
    exp = "@@ @ environment.date :: [2018-01-21T00:00:00Z..2018-02-23T00:00:00Z],>=2018-05-07 => result := 'true'; rule:= 5 @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(20);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.OR
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.AND
                }));
                expect(result.when.condition.left.left).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">="
                }));
                expect(result.when.condition.left.left.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.date"
                }));
                expect(result.when.condition.left.left.right).toEqual(expect.objectContaining({
                    node: Node.DATE,
                    value: new Date(Date.UTC(2018,0,21))
                }));
                expect(result.when.condition.left.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "<="
                }));
                expect(result.when.condition.left.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.date"
                }));
                expect(result.when.condition.left.right.right).toEqual(expect.objectContaining({
                    node: Node.DATE,
                    value: new Date(Date.UTC(2018,1,23))
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">="
                }));
                expect(result.when.condition.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.date"
                }));
                expect(result.when.condition.right.right).toEqual(expect.objectContaining({
                    node: Node.DATE,
                    value: new Date(2018,4,7)
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'true'"
                }));
                expect(result.then.actions[1]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[1].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "rule"
                }));
                expect(result.then.actions[1].expression).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 5
                }));
            });
        });
    });
    exp = "@@ @ environment.time :: [6:00..08:00:00],>=18:00 => result := 'true'; rule:= 5 @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(20);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                let d = new Date(0);
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.OR
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.AND
                }));
                expect(result.when.condition.left.left).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">="
                }));
                expect(result.when.condition.left.left.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.time"
                }));
                expect(result.when.condition.left.left.right).toEqual(expect.objectContaining({
                    node: Node.TIME,
                    value: new Date(d.getFullYear(),d.getMonth(),d.getDate(),6,0,0)
                }));
                expect(result.when.condition.left.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "<="
                }));
                expect(result.when.condition.left.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.time"
                }));
                expect(result.when.condition.left.right.right).toEqual(expect.objectContaining({
                    node: Node.TIME,
                    value: new Date(d.getFullYear(),d.getMonth(),d.getDate(),8,0,0)
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">="
                }));
                expect(result.when.condition.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "environment.time"
                }));
                expect(result.when.condition.right.right).toEqual(expect.objectContaining({
                    node: Node.TIME,
                    value: new Date(d.getFullYear(),d.getMonth(),d.getDate(),18,0,0)
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'true'"
                }));
                expect(result.then.actions[1]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[1].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "rule"
                }));
                expect(result.then.actions[1].expression).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 5
                }));
            });
        });
    });
    exp = "@@ @ age :: ]12..16[,>65 => result := 'true' @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(17);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                //console.log(JSON.stringify(result))
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.OR
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.AND
                }));
                expect(result.when.condition.left.left).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">"
                }));
                expect(result.when.condition.left.left.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "age"
                }));
                expect(result.when.condition.left.left.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 12
                }));
                expect(result.when.condition.left.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "<"
                }));
                expect(result.when.condition.left.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "age"
                }));
                expect(result.when.condition.left.right.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 16
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">"
                }));
                expect(result.when.condition.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "age"
                }));
                expect(result.when.condition.right.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 65
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'true'"
                }));
            });
        });
    });    
    exp = "@@ @ age :: min(user.age,(20+2)-1) => result.acl := 'allow' @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(15);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "=="
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "age"
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.FUNCTION,
                    name: "min"
                }));
                expect(result.when.condition.right.parameters[0]).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.age"
                }));
                expect(result.when.condition.right.parameters[1]).toEqual(expect.objectContaining({
                    node: Node.BINARY_OP,
                    operator: "-"
                }));
                expect(result.when.condition.right.parameters[1].left).toEqual(expect.objectContaining({
                    node: Node.BINARY_OP,
                    operator: "+"
                }));
                expect(result.when.condition.right.parameters[1].left.left).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 20
                }));
                expect(result.when.condition.right.parameters[1].left.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 2
                }));
                expect(result.when.condition.right.parameters[1].right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 1
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result.acl"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'allow'"
                }));
            });
        });
    });
    exp = "@@ @ user.groups.name :: 'admin','guests' => result.acl := 'allow' @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(13);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.OR
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "=="
                }));
                expect(result.when.condition.left.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.groups.name"
                }));
                expect(result.when.condition.left.right).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'admin'"
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "=="
                }));
                expect(result.when.condition.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.groups.name"
                }));
                expect(result.when.condition.right.right).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'guests'"
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result.acl"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'allow'"
                }));
            });
        });
    });
    exp = "@@ @ amount :: 20.8 / 2.1 * 5.9 => result.acl := 'allow' @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(13);
            return parser.parse(lexer).then(parser => {
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "=="
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "amount"
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.BINARY_OP,
                    operator: "*"
                }));
                expect(result.when.condition.right.left).toEqual(expect.objectContaining({
                    node: Node.BINARY_OP,
                    operator: "/"
                }));
                expect(result.when.condition.right.left.left).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 20.8
                }));
                expect(result.when.condition.right.left.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 2.1
                }));
                expect(result.when.condition.right.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    value: 5.9
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result.acl"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'allow'"
                }));
            });
        });
    });
    exp = "@@ @ user.groups :: 'member' && user.age :: >=18 => result.acl := 'allow' @@";
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should contain expected nodes", () => {
            expect.assertions(13);
            return parser.parse(lexer).then(parser => {
                //console.log(JSON.stringify(parser.ast()))
                let result = parser.ast().rules[0];
                expect(result).toEqual(expect.objectContaining({
                    node: Node.RULE
                }));
                expect(result.when).toEqual(expect.objectContaining({
                    node: Node.WHEN
                }));
                expect(result.when.condition).toEqual(expect.objectContaining({
                    node: Node.AND
                }));
                expect(result.when.condition.left).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: "=="
                }));
                expect(result.when.condition.left.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.groups"
                }));
                expect(result.when.condition.left.right).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'member'"
                }));
                expect(result.when.condition.right).toEqual(expect.objectContaining({
                    node: Node.RELATION_OP,
                    operator: ">="
                }));
                expect(result.when.condition.right.left).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "user.age"
                }));
                expect(result.when.condition.right.right).toEqual(expect.objectContaining({
                    node: Node.NUMBER,
                    type: { array: false, buildIn: "Number", node: "NUMBER_TYPE"},
                    value: 18
                }));
                expect(result.then).toEqual(expect.objectContaining({
                    node: Node.THEN
                }));
                expect(result.then.actions[0]).toEqual(expect.objectContaining({
                    node: Node.ASSIGN
                }));
                expect(result.then.actions[0].var).toEqual(expect.objectContaining({
                    node: Node.VAR,
                    name: "result.acl"
                }));
                expect(result.then.actions[0].expression).toEqual(expect.objectContaining({
                    node: Node.STRING,
                    value: "'allow'"
                }));
            });
        });
    });
    exp = "@@ @ user.groups.name xy => @@";
    describe("Exceptions - Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should throw SyntaxError", () => {
            expect.assertions(3);
            return parser.parse(lexer).catch(result => {
                expect(result.name).toEqual("SyntaxError");
                expect(result.data).toEqual(expect.objectContaining({
                    expected: "::",
                    found: "name"
                }));
                expect(result.data.match).toEqual(expect.objectContaining({
                    value: "xy",
                    index: 22
                }));
            });
        });
    });
    exp = "@@ @ user.groups.name :: 'guests' => result := 'allow' xy @@";
    describe("Exceptions - Expression "+exp, () => {
        let lexer = new Lexer(exp);
        let parser = new Parser();
        it("should throw SyntaxError", () => {
            expect.assertions(5);
            return parser.parse(lexer).catch(result => {
                expect(result.name).toEqual("SyntaxError");
                expect(result.code).toEqual("003");
                expect(result.data).toEqual(expect.objectContaining({
                    expected: "End of String",
                    found: "xy"
                }));
                expect(result.data.match).toEqual(expect.objectContaining({
                    value: "xy",
                    index: 55
                }));
                expect(result.data.match.input).toEqual(exp);
            });
        });
    });
});
