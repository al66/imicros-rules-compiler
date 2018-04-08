"use strict";

const Lexer = require("../lib/lexer");
const Token = require("../lib/lexer").Token;

let exp = ""
describe("Test Lexer", () => {
    describe("Empty Expression", () => {
        let lexer = new Lexer(exp);
        it("current should return EOF", () => {
            expect(lexer.current.type).toBe(Token.EOF)
        })
    })
    exp = "5.6"
    describe("Exceptions", () => {
        let lexer = new Lexer(exp);
        it("eat wrong type should throw error", () => {
            expect(() => lexer.eat(Token.STRING)).toThrow("Invalid Syntax")
        })
        it("current: NUMBER 5.6", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(5.6)
            lexer.eat(Token.NUMBER)
        })
        it("current should return EOF", () => {
            expect(lexer.current.type).toBe(Token.EOF)
        })
        it("lookahead should return null", () => {
            expect(lexer._lookahead(1)).toBe(null)
        })
        it("advance should return null", () => {
            expect(lexer._advance()).toBe(null)
        })
        it("eat wrong type should throw error", () => {
            expect(() => lexer.eat(Token.NUMBER)).toThrow("Invalid Syntax")
        })
    })
    exp = "user.groups.name :: 'group:5','group:1' && ressource.status :: 'published' => result.acl := 'allow'; result.rule := 5"
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        it("current: NAME user.groups.name", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toBe("user.groups.name")
            lexer.eat(Token.NAME)
        })
        it("next: IS", () => {
            expect(lexer.current.type).toBe(Token.IS)
            lexer.eat(Token.IS)
        })
        it("next: STRING 'group:5'", () => {
            expect(lexer.current.type).toBe(Token.STRING)
            expect(lexer.current.value).toBe("'group:5'") 
            lexer.eat(Token.STRING)
        })
        it("next: OR", () => {
            expect(lexer.current.type).toBe(Token.OR)
            lexer.eat(Token.OR)
        })
        it("next: STRING 'group:1'", () => {
            expect(lexer.current.type).toBe(Token.STRING)
            expect(lexer.current.value).toBe("'group:1'") 
            lexer.eat(Token.STRING)
        })
        it("next: CONDITION_AND", () => {
            expect(lexer.current.type).toBe(Token.CONDITION_AND)
            lexer.eat(Token.CONDITION_AND)
        })
        it("next: NAME ressource.status", () => {
            expect(lexer.current.type).toBe(Token.NAME); 
            expect(lexer.current.value).toBe("ressource.status"); 
            lexer.eat(Token.NAME)
        })
        it("next: IS", () => {
            expect(lexer.current.type).toBe(Token.IS)
            lexer.eat(Token.IS)
        })
        it("next: STRING 'published'", () => {
            expect(lexer.current.type).toBe(Token.STRING)
            expect(lexer.current.value).toBe("'published'") 
            lexer.eat(Token.STRING)
        })
        it("next: THEN", () => {
            expect(lexer.current.type).toBe(Token.THEN)
            lexer.eat(Token.THEN)
        })
        it("next: NAME result.acl", () => {
            expect(lexer.current.type).toBe(Token.NAME); 
            expect(lexer.current.value).toBe("result.acl"); 
            lexer.eat(Token.NAME)
        })
        it("next: ASSIGN", () => {
            expect(lexer.current.type).toBe(Token.ASSIGN)
            lexer.eat(Token.ASSIGN)
        })
        it("next: STRING 'allow'", () => {
            expect(lexer.current.type).toBe(Token.STRING)
            expect(lexer.current.value).toBe("'allow'") 
            lexer.eat(Token.STRING)
        })
        it("next: SEMICOLON", () => {
            expect(lexer.current.type).toBe(Token.SEMICOLON)
            lexer.eat(Token.SEMICOLON)
        })
        it("next: NAME result.rule", () => {
            expect(lexer.current.type).toBe(Token.NAME); 
            expect(lexer.current.value).toBe("result.rule"); 
            lexer.eat(Token.NAME)
        })
        it("next: ASSIGN", () => {
            expect(lexer.current.type).toBe(Token.ASSIGN)
            lexer.eat(Token.ASSIGN)
        })
        it("next: NUMBER 5", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(5) 
            lexer.eat(Token.NUMBER)
        })
    })
    exp = "@@ ~C# user.groups"
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        it("current: CONTEXT", () => {
            expect(lexer.current.type).toBe(Token.CONTEXT)
            expect(lexer.current.value).toBe("@@")
            lexer.eat(Token.CONTEXT)
        })
        it("next HITPOLICY", () => {
            expect(lexer.current.type).toBe(Token.HITPOLICY)
            expect(lexer.current.value).toBe("~")
            lexer.eat(Token.HITPOLICY)
        })
        it("next: NAME C", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toBe("C")
            lexer.eat(Token.NAME)
        })
        it("next: HASH", () => {
            expect(lexer.current.type).toBe(Token.HASH)
            expect(lexer.current.value).toBe("#")
            lexer.eat(Token.HASH)
        })
        it("next: NAME user.groups", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toBe("user.groups")
            lexer.eat(Token.NAME)
        })
    })
    exp = "user.groups."
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        it("current: NAME user.groups", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toBe("user.groups")
            lexer.eat(Token.NAME)
        })
    })
    exp = "user.age :: >= 18 & <= 65, >= 100"
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        it("current: NAME user.groups", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toBe("user.age")
            lexer.eat(Token.NAME)
        })
        it("next: IS", () => {
            expect(lexer.current.type).toBe(Token.IS)
            lexer.eat(Token.IS)
        })
        it("next: LOGICAL_OPERATOR", () => {
            expect(lexer.current.type).toBe(Token.LOGICAL_OPERATOR)
            lexer.eat(Token.LOGICAL_OPERATOR)
        })
        it("next: NUMBER", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(18)
            lexer.eat(Token.NUMBER)
        })
        it("next: AND", () => {
            expect(lexer.current.type).toBe(Token.AND)
            lexer.eat(Token.AND)
        })
        it("next: LOGICAL_OPERATOR", () => {
            expect(lexer.current.type).toBe(Token.LOGICAL_OPERATOR)
            lexer.eat(Token.LOGICAL_OPERATOR)
        })
        it("next: NUMBER", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(65)
            lexer.eat(Token.NUMBER)
        })
        it("next: OR", () => {
            expect(lexer.current.type).toBe(Token.OR)
            lexer.eat(Token.OR)
        })
        it("next: LOGICAL_OPERATOR", () => {
            expect(lexer.current.type).toBe(Token.LOGICAL_OPERATOR)
            lexer.eat(Token.LOGICAL_OPERATOR)
        })
        it("next: NUMBER", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(100)
            lexer.eat(Token.NUMBER)
        })
    })
    exp = "environment.date :: [2018-1-8..2018-2-23]"
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        it("current: NAME environment.date", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toBe("environment.date")
            lexer.eat(Token.NAME)
        })
        it("next: IS", () => {
            expect(lexer.current.type).toBe(Token.IS)
            lexer.eat(Token.IS)
        })
        it("next: BRACKET_OPEN_RIGHT", () => {
            expect(lexer.current.type).toBe(Token.BRACKET_OPEN_RIGHT)
            lexer.eat(Token.BRACKET_OPEN_RIGHT)
        })
        it("next: DATE", () => {
            expect(lexer.current.type).toBe(Token.DATE)
            expect(lexer.current.value).toEqual(new Date(2018,0,8))
            lexer.eat(Token.DATE)
        })
        it("next: INTERVAL", () => {
            expect(lexer.current.type).toBe(Token.INTERVAL)
            lexer.eat(Token.INTERVAL)
        })
        it("next: DATE", () => {
            expect(lexer.current.type).toBe(Token.DATE)
            expect(lexer.current.value).toEqual(new Date(2018,1,23))
            lexer.eat(Token.DATE)
        })
        it("next: BRACKET_OPEN_LEFT", () => {
            expect(lexer.current.type).toBe(Token.BRACKET_OPEN_LEFT)
            lexer.eat(Token.BRACKET_OPEN_LEFT)
        })
    })
    exp = "environment.time :: [6:00..13:12:10]"
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        it("current: NAME environment.time", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toBe("environment.time")
            lexer.eat(Token.NAME)
        })
        it("next: IS", () => {
            expect(lexer.current.type).toBe(Token.IS)
            lexer.eat(Token.IS)
        })
        it("next: BRACKET_OPEN_RIGHT", () => {
            expect(lexer.current.type).toBe(Token.BRACKET_OPEN_RIGHT)
            lexer.eat(Token.BRACKET_OPEN_RIGHT)
        })
        it("next: TIME", () => {
            expect(lexer.current.type).toBe(Token.TIME)
            let d = new Date(0)
            let t = new Date(d.getFullYear(),d.getMonth(),d.getDate(),6,0,0);
            //expect(lexer.current.value).toEqual(t)
            expect(lexer.current.value.getHours()).toEqual(t.getHours())
            expect(lexer.current.value.getMinutes()).toEqual(t.getMinutes())
            expect(lexer.current.value.getSeconds()).toEqual(t.getSeconds())
            lexer.eat(Token.TIME)
        })
        it("next: INTERVAL", () => {
            expect(lexer.current.type).toBe(Token.INTERVAL)
            lexer.eat(Token.INTERVAL)
        })
        it("next: TIME", () => {
            expect(lexer.current.type).toBe(Token.TIME)
            let d = new Date(0)
            let t = new Date(d.getFullYear(),d.getMonth(),d.getDate(),13,12,10);
            expect(lexer.current.value.getHours()).toEqual(t.getHours())
            expect(lexer.current.value.getMinutes()).toEqual(t.getMinutes())
            expect(lexer.current.value.getSeconds()).toEqual(t.getSeconds())
            lexer.eat(Token.TIME)
        })
        it("next: BRACKET_OPEN_LEFT", () => {
            expect(lexer.current.type).toBe(Token.BRACKET_OPEN_LEFT)
            lexer.eat(Token.BRACKET_OPEN_LEFT)
        })
    })
    exp = "environment.timestamp :: ]2018-1-21 6:00..2018-2-23 13:12:10["
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        it("current: NAME environment.timestamp", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toBe("environment.timestamp")
            lexer.eat(Token.NAME)
        })
        it("next: IS", () => {
            expect(lexer.current.type).toBe(Token.IS)
            lexer.eat(Token.IS)
        })
        it("next: BRACKET_OPEN_LEFT", () => {
            expect(lexer.current.type).toBe(Token.BRACKET_OPEN_LEFT)
            lexer.eat(Token.BRACKET_OPEN_LEFT)
        })
        it("next: DATE", () => {
            expect(lexer.current.type).toBe(Token.DATE)
            let t = new Date(2018,0,21,6,0,0);
            expect(lexer.current.value).toEqual(t)
            lexer.eat(Token.DATE)
        })
        it("next: INTERVAL", () => {
            expect(lexer.current.type).toBe(Token.INTERVAL)
            lexer.eat(Token.INTERVAL)
        })
        it("next: DATE", () => {
            expect(lexer.current.type).toBe(Token.DATE)
            let t = new Date(2018,1,23,13,12,10);
            expect(lexer.current.value).toEqual(t)
            lexer.eat(Token.DATE)
        })
        it("next: BRACKET_OPEN_RIGHT", () => {
            expect(lexer.current.type).toBe(Token.BRACKET_OPEN_RIGHT)
            lexer.eat(Token.BRACKET_OPEN_RIGHT)
        })
    })
    exp = "age :: ]12..18["
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        it("current: NAME age", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toBe("age")
            lexer.eat(Token.NAME)
        })
        it("next: IS", () => {
            expect(lexer.current.type).toBe(Token.IS)
            lexer.eat(Token.IS)
        })
        it("next: BRACKET_OPEN_LEFT", () => {
            expect(lexer.current.type).toBe(Token.BRACKET_OPEN_LEFT)
            expect(lexer.current.value).toBe("]")
            lexer.eat(Token.BRACKET_OPEN_LEFT)
        })
        it("next: NUMBER", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toEqual(12)
            lexer.eat(Token.NUMBER)
        })
        it("next: INTERVAL", () => {
            expect(lexer.current.type).toBe(Token.INTERVAL)
            lexer.eat(Token.INTERVAL)
        })
        it("next: NUMBER", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toEqual(18)
            lexer.eat(Token.NUMBER)
        })
        it("next: BRACKET_OPEN_RIGHT", () => {
            expect(lexer.current.type).toBe(Token.BRACKET_OPEN_RIGHT)
            lexer.eat(Token.BRACKET_OPEN_RIGHT)
        })
    })
    exp = "5+(6.5*x) * 2.445-3.56 / 8"
    describe("Expression "+exp, () => {
        let lexer = new Lexer(exp);
        it("current: NUMBER 5", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(5)
            lexer.eat(Token.NUMBER)
        })
        it("next: PLUS", () => {
            expect(lexer.current.type).toBe(Token.PLUS)
            lexer.eat(Token.PLUS)
        })
        it("next: PARENTHESIS_LEFT", () => {
            expect(lexer.current.type).toBe(Token.PARENTHESIS_LEFT)
            lexer.eat(Token.PARENTHESIS_LEFT)
        })
        it("next: NUMBER 6.5", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(6.5)
            lexer.eat(Token.NUMBER)
        })
        it("next: MULT", () => {
            expect(lexer.current.type).toBe(Token.MULT)
            lexer.eat(Token.MULT)
        })
        it("next: NAME", () => {
            expect(lexer.current.type).toBe(Token.NAME)
            expect(lexer.current.value).toEqual("x")
            lexer.eat(Token.NAME)
        })
        it("next: PARENTHESIS_RIGHT", () => {
            expect(lexer.current.type).toBe(Token.PARENTHESIS_RIGHT)
            lexer.eat(Token.PARENTHESIS_RIGHT)
        })
        it("next: MULT", () => {
            expect(lexer.current.type).toBe(Token.MULT)
            lexer.eat(Token.MULT)
        })
        it("next: NUMBER 2.445", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(2.445)
            lexer.eat(Token.NUMBER)
        })
        it("next: MINUS", () => {
            expect(lexer.current.type).toBe(Token.MINUS)
            lexer.eat(Token.MINUS)
        })
        it("next: NUMBER 3.56", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(3.56)
            lexer.eat(Token.NUMBER)
        })
        it("next: DIV", () => {
            expect(lexer.current.type).toBe(Token.DIV)
            lexer.eat(Token.DIV)
        })
        it("next: NUMBER 8", () => {
            expect(lexer.current.type).toBe(Token.NUMBER)
            expect(lexer.current.value).toBe(8)
            lexer.eat(Token.NUMBER)
        })
    })
})