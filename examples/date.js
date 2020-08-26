"use strict";

const { Compiler } = require("../index");
const beautify = require("js-beautify").js_beautify;

let exp, input = [], response;
// Define rule set
exp = "@@ ~C current.date[date]; > next.date[date]; > add.date[date]";
//exp += "~F user.groups.name[..string]; > result.acl[string]:= 'decline'; > result.rule[number]:= 0"
//exp += "@ user.groups.name :: 'admin','guests' => result.acl := 'allow'; result.rule := 1; result.obj := user"
//exp += "@ user.groups.name :: 'others','members' => result.acl := 'allow'; result.rule := 2; result.obj := user"
//exp += "@  => result.obj := user; result.obj.param1 := params.param1"
exp += "@  => add.date := 10";
exp += "@  => next.date := current.date + 259200000";
exp += "@@";



input[0] = { current: { date: new Date() } };
//input[1] = {user: { groups: { name: ["guests"] } }};     
//input[2] = {user: { groups: { name: ["members"] } }};     
//input[3] = {user: { groups: { name: ["admins"] } }};     

let now = new Date().valueOf();
console.log(now);
console.log(new Date(now));
let newDate = now + (1000 * 60 * 60 * 24 * 3);
console.log(newDate);
console.log(new Date(newDate));

Compiler.compile(exp).then(strFunction => {
    let f = new Function(strFunction)();
    console.log(beautify(f.toString(), { indent_size: 2, wrap_line_length: 80 }));
    for ( let i = 0; i < input.length; i++ ) {
        response = f(input[i]);    
        console.log(JSON.stringify(input[i]), "=>", JSON.stringify(response));
        console.log((Date.parse(input[i].current.date)+ parseInt(10)));
        console.log(new Date(newDate));
    }
});
