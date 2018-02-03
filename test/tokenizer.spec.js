'use strict';

const matchToToken = require("../lib/tokenizer").matchToToken;
const ifeel = require("../lib/tokenizer").ifeel;

let exp = "";

describe("Test tokenizer", () => {
    exp = "x > (12.4 * 7)";
    describe("Expression "+exp, () => {
        let ts = "x > (12.4 * 7)";
        let tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(exp))) {
            tokens.push(token);
        };
        it("array length should be 11", () => {
            expect(tokens.length).toBe(11); 
        });
        it("should contain expected token", () => {
            let i = 0;
            expect(tokens[i++].value).toBe("x");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe(">");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("(");
            expect(tokens[i++].value).toBe("12.4");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("*");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("7");
            expect(tokens[i++].value).toBe(")");
        })
    })
    exp = "x < #";
    describe("Expression "+exp, () => {
        let tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(exp))) {
            tokens.push(token);
        };
        it("array length should be 4", () => {
            expect(tokens.length).toBe(4); 
        });
        it("should contain expected token", () => {
            let i = 0;
            expect(tokens[i++].value).toBe("x");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("<");
            expect(tokens[i++].type).toBe("whitespace");
        })
    })
    exp = "i++";
    describe("Expression "+exp, () => {
        let tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(exp))) {
            tokens.push(token);
        };
        it("array length should be 2", () => {
            expect(tokens.length).toBe(2); 
        });
        it("should contain expected token", () => {
            let i = 0;
            expect(tokens[i++].value).toBe("i");
            expect(tokens[i++].value).toBe("++");
        })
    })
    exp = 'user == "Max"';
    describe("Expression "+exp, () => {
        let tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(exp))) {
            tokens.push(token);
        };
        it("array length should be 5", () => {
            expect(tokens.length).toBe(5); 
        });
        it("should contain expected token", () => {
            let i = 0;
            expect(tokens[i++].value).toBe("user");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("==");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i].closed).toBe(true);
            expect(tokens[i++].value).toBe('"Max"');
        })
    })
    exp = "user == 'Max'";
    describe("Expression "+exp, () => {
        let tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(exp))) {
            tokens.push(token);
        };
        it("array length should be 5", () => {
            expect(tokens.length).toBe(5); 
        });
        it("should contain expected token", () => {
            let i = 0;
            expect(tokens[i++].value).toBe("user");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("==");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i].closed).toBe(true);
            expect(tokens[i++].value).toBe("'Max'");
        })
    });
    exp = "user == 'String not closed";
    describe("Expression "+exp, () => {
        let tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(exp))) {
            tokens.push(token);
        };
        it("array length should be 5", () => {
            expect(tokens.length).toBe(5); 
        });
        it("should contain expected token", () => {
            let i = 0;
            expect(tokens[i++].value).toBe("user");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("==");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i].closed).toBe(false);
            expect(tokens[i++].value).toBe("'String not closed");
        })
    });
    exp = "user.groups.name contains 'SAP Support','SAP Core Team' && ressource.status is 'published' && operation.type is ['read','write'] && operation.status == 'realized' && environment.date in [21.1.2018..23-2-2018,5/23/2016]";
    describe("Expression - complex", () => {
        let tokens = [];
        let token;
        while (token = matchToToken(ifeel.exec(exp))) {
            tokens.push(token);
        };
        it("array length should be >= 4", () => {
            expect(tokens.length >= 4).toBe(true); 
        });
        it("should contain expected token", () => {
            let i = 0;
            expect(tokens[i++].value).toBe("user");
            expect(tokens[i++].value).toBe(".");
            expect(tokens[i++].value).toBe("groups");
            expect(tokens[i++].value).toBe(".");
            expect(tokens[i++].value).toBe("name");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("contains");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("'SAP Support'");
            expect(tokens[i++].value).toBe(",");
            expect(tokens[i++].value).toBe("'SAP Core Team'");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("&&");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("ressource");
            expect(tokens[i++].value).toBe(".");
            expect(tokens[i++].value).toBe("status");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("is");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("'published'");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("&&");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("operation");
            expect(tokens[i++].value).toBe(".");
            expect(tokens[i++].value).toBe("type");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("is");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("[");
            expect(tokens[i++].value).toBe("'read'");
            expect(tokens[i++].value).toBe(",");
            expect(tokens[i++].value).toBe("'write'");
            expect(tokens[i++].value).toBe("]");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("&&");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("operation");
            expect(tokens[i++].value).toBe(".");
            expect(tokens[i++].value).toBe("status");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("==");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("'realized'");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("&&");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("environment");
            expect(tokens[i++].value).toBe(".");
            expect(tokens[i++].value).toBe("date");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("in");
            expect(tokens[i++].type).toBe("whitespace");
            expect(tokens[i++].value).toBe("[");
            expect(tokens[i++].value).toBe("21.1.2018");
            expect(tokens[i++].value).toBe("..");
            expect(tokens[i++].value).toBe("23-2-2018");
            expect(tokens[i++].value).toBe(",");
            expect(tokens[i++].value).toBe("5/23/2016");
            expect(tokens[i++].value).toBe("]");
        })
    });    
});