"use strict";

const { Compiler } = require("../index");
// const beautify = require("js-beautify").js_beautify;

describe("Test Compiler - parse ruleset", () => {
    describe("Compile and execute expression", () => {
        let exp = "@@ ";
        exp += "~F user.groups.name[..string]; > result.acl[string]:= 'decline'; > result.rule[number]:= 0";
        exp += "@ user.groups.name :: 'admin','guests' => result.acl := 'allow'; result.rule := 1";
        exp += "@ user.groups.name :: 'others','members' => result.acl := 'allow'; result.rule := 2";
        exp += "@@";
        it("compiled function should return expected results", () => {
            return Compiler.compile(exp).then(strFunction => {
                let f = new Function(strFunction)();
                //console.log(beautify(f.toString(), { indent_size: 2, wrap_line_length: 80 }));
                let response = f({user: { groups: { name: ["users"] } }});
                expect(response.result.acl).toEqual("decline");
                expect(response.result.rule).toEqual(0);
                response = f({user: { groups: { name: ["guests"] } }});
                expect(response.result.acl).toEqual("allow");
                expect(response.result.rule).toEqual(1);
                response = f({user: { groups: { name: ["admin"] } }});
                expect(response.result.acl).toEqual("allow");
                expect(response.result.rule).toEqual(1);
                response = f({user: { groups: { name: ["others"] } }});
                expect(response.result.acl).toEqual("allow");
                expect(response.result.rule).toEqual(2);
                response = f({user: { groups: { name: ["members"] } }});
                expect(response.result.acl).toEqual("allow");
                expect(response.result.rule).toEqual(2);
            });
        });
    });

    describe("Parse Expression to Json", () => {
        let exp = "@@ ~C ";
        exp += "environment.date[..date] #Current date#; user.locale[string]:='en' #Locale#; count[number]:= 1+1; >date[date] := environment.date; > result[boolean]:=false";
        exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00],>=2018-05-07 09:00 => result := true; rule:= 1 # rule one # ";
        exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00[,>=2018-05-07 09:00 & <= 2020-05-07 09:00 => result := user.confirmed(a) + 1 + 'yes'; rule:= 1 + 1  # rule two # ";
        exp += "@ user.locale :: 'de','es' => result := user.confirmed(a); rule:= 1 + 1  # rule two # ";
        exp += "@ environment.date :: [2018-1-21 06:00..2018-2-23 08:00],>=2018-05-07 09:00 => result := false; rule:= 3 # rule three # ";
        exp += "@ user.name :: 'Max' => result := 'yes'; rule:= 4  # undefined var # ";
        exp += " @@";
        it("resulting json should return contain expected path", () => {
            return Compiler.toJson(exp).then(ruleset => {
                expect(ruleset).toBeDefined();
                expect(ruleset.input).toContainEqual({ label: "Current date", source: "environment.date", type: "date", array: true});
                expect(ruleset.input).toContainEqual({ label: "Locale", source: "user.locale", type: "string", array: false, default: "'en'"});
                expect(ruleset.input).toContainEqual({ label: "", source: "count", type: "number", array: false, default: "1 + 1"});
                expect(ruleset.output).toContainEqual({ label: "", destination: "date", type: "date", array: false});
            });
        });
    });
});
