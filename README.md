# imicros-rules-compiler
[![Build Status](https://travis-ci.org/al66/imicros-rules-compiler.svg?branch=master)](https://travis-ci.org/al66/imicros-rules-compiler)
[![Coverage Status](https://coveralls.io/repos/github/al66/imicros-rules-compiler/badge.svg?branch=master)](https://coveralls.io/github/al66/imicros-rules-compiler?branch=master)

## Installation
```
$ npm install imicros-rules-compiler --save
```

# Usage
## Usage Compiler
```js
const { Compiler } = require("imicros-rules-compiler");

let exp;
// Define rule set
exp = "@@ "
exp += "~F user.groups.name[..string]; > result.acl[string]:= 'decline'; > result.rule[number]:= 0"
exp += "@ user.groups.name :: 'admin','guests' => result.acl := 'allow'; result.rule := 1"
exp += "@ user.groups.name :: 'others','members' => result.acl := 'allow'; result.rule := 2"
exp += "@@"

Compiler.compile(exp).then(strFunction => {
    // The compiled function can be stored somewhere as a string
    
    // For execution create a function from the string...
    let f = new Function(strFunction)();    
                                           
    // ...and execute the ruleset function with parameters to check against the rules
    let response = f({user: { groups: { name: ["users"] } }});
    console.log(JSON.stringify(response))   // {"result":{"acl":"decline","rule":0}}
    response = f({user: { groups: { name: ["guests"] } }});                                       
    console.log(JSON.stringify(response))   // {"result":{"acl":"allow","rule":1}}
    response = f({user: { groups: { name: ["members"] } }});                                       
    console.log(JSON.stringify(response))   // {"result":{"acl":"allow","rule":2}}                                     
});

```
# Rules Language
<code>@</code> starts a new rule.
<code>=></code> starts the defintion the resulting output.
All conditions are defined left of <code>=></code>. Multiple conditions are separated by <code>;</code>.
Each condition has exactly one parameter on the left side of <code>::</code> the required values to check on the right side.
The expression on the right side can be a single value, a list of values, a comparison like <code>> 5</code> or a range <code>[2018-1-21..2018-2-23]</code>.
After the initial <code>@@</code> can follow the hit policy <code>~F</code> and type defintions of the used parameters in the ruleset. Definitions of output parameter are noted with a leading <code>></code>.

