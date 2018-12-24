"use strict";

let globals = "let r = {};";

function setToValue(obj, path, value) {
    let i;
    path = path.split(".");
    for (i = 0; i < path.length - 1; i++) {
        if (!obj[path[i]]) obj[path[i]] = {};
        obj = obj[path[i]];
    }
    obj[path[i]] = value;
}

globals += setToValue.toString();

function getValue(obj, path, isArray) {
    let a = [];
    let i;
    path = path.split(".");
    for (i = 0; i < path.length; i++) {
        if (!obj[path[i]]) {obj = null; break;}
        obj = obj[path[i]];
    }
    if (isArray && !Array.isArray(obj)) { if (obj) a.push(obj); obj = a; }
    return obj;
}

globals += getValue.toString();

/*
function getTime(str) {
    let d = new Date(0)
    let t = Date.parse('1970-01-01 ' + str)
    if (t instanceof Date && !isNaN(t.valueOf())) {
        return t 
    }
    return new Date(d.getFullYear(),d.getMonth(),d.getDate(),t.getHours(),t.getMinutes(),t.getSeconds()).getTime();
}
*/

function getTime(str) {
    return Date.parse("1970-01-01 " + str);
}

globals += getTime.toString();

module.exports = globals;