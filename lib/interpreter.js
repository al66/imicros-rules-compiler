/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 *
 * @source Ruslan's blog - Let's build a simple interpreter https://ruslanspivak.com/lsbasi-part7/ - excellent introduction
 *
 */
"use strict";

class Node {

    static get RULE() { return "RULE"; }
    static get THEN() { return "THEN"; }
    static get ASSIGN() { return "ASSIGN"; }
    static get WHEN() { return "WHEN"; }
    static get CONDITION() { return "CONDITION"; }

    static get EXPRESSION() { return "EXPRESSION"; }
    
    static get IS() { return "::"; }
    static get AND() { return "&"; }
    static get OR() { return "|"; }
    //static get ACTIONLIST() { return "ACTIONS"; }
    //static get ACTION() { return "ACTION"; }
    static get CONDITION_AND() { return "&&"; }
    
    constructor (object) {
        Object.assign(this, object);
    }
    
}

class Interpreter {
    static build (node) {
        switch (node.type) {
            case Node.RULE: return this.buildRule(node);
            case Node.THEN: return this.buildThen(node);    
            case Node.ASSIGN: return this.buildAssign(node);    
            case Node.WHEN: return this.buildWhen(node);    
            case Node.CONDITION: return this.buildCondition(node);    
            case Node.EXPRESSION: return this.buildExpression(node);    

                //case Node.IS: return this.buildIs(node);
            //case Node.ACTIONLIST: return this.buildActionList(node);    
        }
    }
    
    static buildRule (node) {
        // if( ( WHEN | true ) { THEN } return c;
        return ("if("+(Interpreter.build(node.when) || "true")+"){"+Interpreter.build(node.then)+"}return c;");
    }
    
    static buildThen (node) {
        let list = "";
        for (let key in node.actions) {
            list += Interpreter.build(node.actions[key]) + ";";
         }
        return list;
    }
    
    static buildAssign (node) {
        return ("c.setParam('" + node.name + "',"+ Interpreter.build(node.expression) +")");
    }
    
    /*
    static buildIs (node) {
        return ("");
    }
    */
    
    static buildWhen (node) {
        // ( CONDITION && CONDITION )
        let list = null;
        for (let key in node.conditions) {
            !list ? list = "" : list += "&&";
            list += "(" + Interpreter.build(node.conditions[key]) + ")";
         }
        return list;
    }
    
    static buildCondition (node) {
        let conditions = ""
        for (let key in node.conditions) {
            if (conditions.length > 0 ) conditions += "||";
            conditions += "(c.getParam('" + node.name + "').some((value)=>{return(value==" + Interpreter.build(node.conditions[key]) + ")}))";
         }
        return ("(" + (conditions || "true") + ")");
    }
    
    static buildExpression (node) {
        return node.expression;
    }
}

module.exports = Interpreter;
module.exports.Node = Node;