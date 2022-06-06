# imicros-rules-compiler

__Not longer maintained__  
__Replaced by [imicros-feel-interpreter](https://github.com/al66/imicros-feel-interpreter) as rules engine__.__

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
- <code>@@</code> starts and ends the ruleset.
- <code>@</code> starts a new rule.
- <code>=></code> starts the defintion the resulting output.
- All conditions are defined left of <code>=></code>. Multiple conditions are separated by <code>;</code>.
Each condition has exactly one parameter on the left side of <code>::</code> the required values to check on the right side.
- The expression on the right side of an condition can be a single value, a list of values, a comparison like <code>> 5</code> or a range <code>[2018-1-21..2018-2-23]</code>.
- After the initial <code>@@</code> can follow the hit policy <code>~F</code> and type defintions of the used parameters in the ruleset. Definitions of output parameter are noted with a leading <code>></code>. Parameters can be initialized with default values - e.g. <code>result.acl[string]:= 'decline'</code>.
## Type definitions
Valid types are
-   <code>[string]</code>
-   <code>[..string]</code> array of strings
-   <code>[number]</code> - as decimal point, only <code>.</code> is allowed. The regex for numbers is <code>/(0[xX][ \d a-f A-F ]+|0[oO][0-7]+|0[bB][01]+|(?:\d+(?!(?:\.\d|\d)))|(?:\d+\.\d+)(?!(?:\.\d|\d))(?: [eE][+-]?\d+ )?)/</code>
-   <code>[..number]</code> array of numbers
-   <code>[date]</code>
-   <code>[..date]</code> array of dates
-   <code>[time]</code>
-   <code>[..time]</code> array of times
-   <code>[boolean]</code>
## Examples for valid conditions
-   <code>user.age :: >= 16 & <= +35</code> Age is between 16 and 35
-   <code>environment.date :: [2018-1-21..2018-2-23],>=2018-05-07</code> Date is between 2018-1-21 and 2018-2-23 or greater equal 2018-05-07
-   <code>environment.time :: [6:00..08:00:00],>=18:00</code> Time is between 6 and 8 am or after 6pm
-   <code>age :: ]12..16[,>65</code> Age is between 13 and 15 (the interval values 12 and 16 are excluded).



