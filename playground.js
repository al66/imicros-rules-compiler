'use strict';

const param = require("./examples/param").acl;
var context = require("./lib/context");

context.param = param;

let fs = "{c.param.names=c.getParam('user..name').some((value)=>{return(value=='group:2')});c.param.id=c.getParam('ressource.id');c.param.folders=c.getParam('ressource.folders');c.setParam('operation.allowed',true)};return c;";

fs = "if(((c.getParam('user.groups.name').some((value)=>{return(value=='group:100')})))&&((c.getParam('ressouce.folder').some((value)=>{return(value=='public')}))||(c.getParam('ressouce.folder').some((value)=>{return(value=='user')})))&&((c.getParam('environment.temperature').some((value)=>{return(value==17.0)})))) {c.setParam('acl.result','allowed');c.setParam('acl.rule','7778');} return c;"
let f = new Function("c",fs);
//try {
    context = f(context);
//} catch(err) { context.error.push(err) }
console.log(JSON.stringify(context.param));
