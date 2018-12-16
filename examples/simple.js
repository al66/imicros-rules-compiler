/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 */
"use strict";

const { Compiler } = require("../index");
const beautify = require('js-beautify').js_beautify;

let exp, input = [], response;
// Define rule set
exp = "@@ "
exp += "~F user.groups.name[..string]; > result.acl[string]:= 'decline'; > result.rule[number]:= 0"
exp += "@ user.groups.name :: 'admin','guests' => result.acl := 'allow'; result.rule := 1"
exp += "@ user.groups.name :: 'others','members' => result.acl := 'allow'; result.rule := 2"
exp += "@@"

input[0] = {user: { groups: { name: ["users"] } }};
input[1] = {user: { groups: { name: ["guests"] } }};     
input[2] = {user: { groups: { name: ["members"] } }};     

Compiler.compile(exp).then(strFunction => {
    let f = new Function(strFunction)();
    console.log(beautify(f.toString(), { indent_size: 2, wrap_line_length: 80 }));
    for ( let i = 0; i < input.length; i++ ) {
        response = f(input[i]);    
        console.log(JSON.stringify(input[i]), '=>', JSON.stringify(response));
    }
});

                           