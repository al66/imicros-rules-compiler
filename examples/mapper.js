/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 */
"use strict";

const { Compiler } = require("../index");
const beautify = require('js-beautify').js_beautify;

let exp, input = [], response;
// Define rule set
exp = "@@ ~C "
//exp += "~F user.groups.name[..string]; > result.acl[string]:= 'decline'; > result.rule[number]:= 0"
//exp += "@ user.groups.name :: 'admin','guests' => result.acl := 'allow'; result.rule := 1; result.obj := user"
//exp += "@ user.groups.name :: 'others','members' => result.acl := 'allow'; result.rule := 2; result.obj := user"
exp += "@  => result.obj := user; result.obj.param1 := params.param1"
exp += "@  => result.obj.param2 := params.param2"
exp += "@@"


input[0] = {user: { groups: { name: ["users"] } }, params: { param1: "Param1", param2: "Param2" }};
input[1] = {user: { groups: { name: ["guests"] } }};     
input[2] = {user: { groups: { name: ["members"] } }};     
input[3] = {user: { groups: { name: ["admins"] } }};     

Compiler.compile(exp).then(strFunction => {
    let f = new Function(strFunction)();
    console.log(beautify(f.toString(), { indent_size: 2, wrap_line_length: 80 }));
    for ( let i = 0; i < input.length; i++ ) {
        response = f(input[i]);    
        console.log(JSON.stringify(input[i]), '=>', JSON.stringify(response));
    }
    // performance
    let t1 = Date.now();
    for ( let n = 0; n < 100000; n++ ) {
        let f = new Function(strFunction)();
        f(input[0]);
    }
    console.log("Runtime:", Date.now() - t1);
});
