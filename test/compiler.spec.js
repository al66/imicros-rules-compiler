"use strict";

const Compiler = require("../lib/compiler");
var context = require("../lib/context");

const param = require("../examples/param").acl;
context.param = param;

let tests = [];
let single = {};
single.expression = "user.groups.name :: 'group:1' => result.acl := 'allow'";
single.result = {acl:"allow"};
tests.push(single);
single.expression = "user.groups.name :: 'group:5' => result.acl := 'allow'";
single.result = {};
tests.push(single);
single.expression = "user.groups.name :: 'group:5','group:1' => result.acl := 'allow'";
single.result = {acl:"allow"};
tests.push(single);
/*
single.expression = "user.groups.name :: 'group:5','group:1' && ressource.status :: 'published' => result.acl := 'allow'";
single.result = {acl:"allow"};
tests.push(single);
single.expression = "user.groups.name :: 'group:5','group:1' && ressource.status :: 'unpublished' => result.acl := 'allow'";
single.result = {};
tests.push(single);
single.expression = "user.groups.name :: 'group:1' => result.acl := 'allow'; result.found := true";
single.result = {acl:"allow", found: true};
tests.push(single);
single.expression = "=> result.acl := 'allow'";
single.result = {acl:"allow"};
tests.push(single);
*/

// user.groups.name :: 'SAP Support','SAP Core Team' & !'Guests' && ressource.status :: 'published' && operation.type :: ['read','write'] && operation.status :: 'realized' && environment.temperature :: [15.33 .. 17.9],5,>=7 & <= environment.highest + 2 && environment.date :: [21.1.2018..23-2-2018,5/23/2016] =>  acl.status := 'alowed'


describe("Expressions",() => {
    let key;
    for (key in tests) {
        describe("Expression: "+tests[key].expression,() => {
            let exp = new Compiler(tests[key].expression);
            it("should be", () => {
                expect.assertions(1);
                return exp.parse().then(result => {
                    console.log("FUNCTION:", result);
                    let c;
                    try {
                        let f = new Function("c",result);
                        c = f(context);
                    } catch(err) { 
                        console.log("FUNCTION:", result);
                        console.log(err) 
                    }            
                    expect(c.param.result).toEqual(tests[key].result);
                })
            });
        })
    }
})
