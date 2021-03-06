/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 * @source https://github.com/lydell/js-tokens
 * @source https://github.com/dominictarr/js-tokenizer
 */
"use strict";

function combine () {
    return new RegExp([].slice.call(arguments).map(function (e) {
        let s = e.toString();
        return s.substring(1, s.length - 1);
    })
    .join("|"),"g");
}

let pattern = {
    string      : /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)/,
    label       : /(#)([^#]*)(#)/,
    date_utc    : /([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z)/,
    date        : /(\d+\-\d+\-\d+|\d+\.\d+\.\d+|\d+\/\d+\/\d+)/,
    time        : /(\d{1,2}:\d{2}(?::\d{2})?)/,
    //number      : /(0[xX][ \d a-f A-F ]+|0[oO][0-7]+|0[bB][01]+|(?:\d+(?![\.\d]))|(?:\d+\.\d+)(?![\.])(?: [eE][+-]?\d+ )?)/,
    number      : /(0[xX][ \d a-f A-F ]+|0[oO][0-7]+|0[bB][01]+|(?:\d+(?!(?:\.\d|\d)))|(?:\d+\.\d+)(?!(?:\.\d|\d))(?: [eE][+-]?\d+ )?)/,
    comparator  : /(==|<=(?!=)|>=(?!=)|<{1}|<>)/,
    logical     : /(&&|\|\|)/,
    operator    : /(--|\+\+|::|=>|:=|\.\.|@@|#)|\*{1,2}/,
    punctuator  : /(@|\.{3}|\.{2}|(?:[+\-/%&|^]|<{2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])/,
    // See <http://mathiasbynens.be/notes/javascript-identifiers>
    name        : /((?!\d)(?:(?!\s)[ $ \w \u0080-\uFFFF ]|\\u[ \d a-f A-F ]{4}|\\u\{[ \d a-f A-F ]+\})+)/,
    whitespace  : /(\s+|\s)/
};

let match = combine(
    pattern.string,
    pattern.label,
    pattern.date_utc,
    pattern.date,
    pattern.time,
    pattern.number,
    pattern.comparator,
    pattern.logical,
    pattern.operator,
    pattern.punctuator,
    pattern.name,
    pattern.whitespace
);

exports.ifeel = match;

function matchToToken (match) {
    if (match) {
        let token = {type: "invalid", value: match[0], index: match.index, input: match.input};
        if (match[ 1]) token.type = "string" , token.closed = !!(match[2] && match[3]);
        else if (match[ 6]) token.type = "label" , token.value = match[ 6];
        else if (match[ 8]) token.type = "date";
        else if (match[ 9]) token.type = "date";
        else if (match[10]) token.type = "time";
        else if (match[11]) token.type = "number";
        else if (match[12]) token.type = "operator" , token.sub = "comparator";
        else if (match[13]) token.type = "operator" , token.sub = "logical";
        else if (match[14]) token.type = "operator";
        else if (match[15]) token.type = "punctuator";
        else if (match[16]) token.type = "name";
        else if (match[17]) token.type = "whitespace";
        //
        return token;
    } else {
        return null;
    }
}

exports.matchToToken = matchToToken;