"use strict";

const Compiler = require("../index");
const beautify = require('js-beautify').js_beautify;

let exp;
describe("Test Compiler - parse ruleset", () => {
    exp = "@@ "
    exp += "~F user.groups.name[..string]; > result.acl[string]:= 'decline'; > result.rule[number]:= 0"
    exp += "@ user.groups.name :: 'admin','guests' => result.acl := 'allow'; result.rule := 1"
    exp += "@ user.groups.name :: 'others','members' => result.acl := 'allow'; result.rule := 2"
    exp += "@@"
    describe("Test Expression: "+exp, () => {
        it("compiled function should return expected results", () => {
            return Compiler.compile(exp).then(strFunction => {
                let f = new Function(strFunction)();
                //console.log(beautify(f.toString(), { indent_size: 2, wrap_line_length: 80 }));
                let response = f({user: { groups: { name: ["users"] } }})
                expect(response.result.acl).toEqual("decline")
                expect(response.result.rule).toEqual(0)
                response = f({user: { groups: { name: ["guests"] } }})
                expect(response.result.acl).toEqual("allow")
                expect(response.result.rule).toEqual(1)
                response = f({user: { groups: { name: ["admin"] } }})
                expect(response.result.acl).toEqual("allow")
                expect(response.result.rule).toEqual(1)
                response = f({user: { groups: { name: ["others"] } }})
                expect(response.result.acl).toEqual("allow")
                expect(response.result.rule).toEqual(2)
                response = f({user: { groups: { name: ["members"] } }})
                expect(response.result.acl).toEqual("allow")
                expect(response.result.rule).toEqual(2)
            })
        })
    })
})
