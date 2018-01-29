/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 */
'use strict';

// example expression: user.groups.name contains 'SAP Support' && ressource.status is 'published' && operation.type in ['read','write']

const param = require("./examples/param").acl;
const ifeel = require("./lib/compiler");
var context = require("./lib/context");

context.param = param;
//

let ts = "user.groups.name contains 'SAP Support','SAP Core Team' && ressource.status is 'published' && operation.type is ['read','write'] && operation.status == 'realized' && environment.temperature is ([15.33 .. 17.9],5,>=7 and <= 200.7) && environment.date in [21.1.2018..23-2-2018,5/23/2016]";

console.log("EXPRESSION:", ts);
ifeel.compile(ts).then((compiled) => {
    console.log("COMPILED:", compiled);
    
    //let fs = "if (c.get('user.groups.name').indexOf('SAP Support') >= 0 && c.get('ressource.status') == 'published' && ['read','write'].indexOf(c.get('operation.type')) >= 0 ) {c.result = true }; c.count++; return c;"
    let fsm = "if ((c.compare(c.get('user.groups.name'),'SAP Support')) && c.compare(c.get('ressource.status'),'published')  && c.compare(c.get('operation.type'),['read','write']) ) {c.result = true} ; c.count++; return c;"
    console.log("FSM:", fsm);
    let fs = compiled+" {c.result = true} ; c.count++; return c;"
    console.log("RUN:", fs);
    
    let start = Date.now();
    let test = function() {
        return new Promise((resolve, reject) => {  
            for (let i=1; i < 500; i++) {
                let f = new Function("c",fs);
                //try {
                    context = f(context);
                //} catch(err) { context.error.push(err) }
            }
            resolve();
        });
    }
    test().then(() => {
        let end = Date.now();
        console.log("CONTEXT:", context);
        console.log("Laufzeit: %d", end-start);
    });
    
});



