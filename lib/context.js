/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 */
"use strict";

const JSPath = require("jspath");

class Context {
    
    constructor () {
        this.cache = [];
        this.count =  0;
        this.error =  [];
    }
    
    getParam (path) {
        let result = [];
        // get from cache
        if (this.cache[path]) {
            result = this.cache[path];
        } else {
            let p = JSPath.apply("."+path, this.param);
            // always return an array
            if (Array.isArray(p)) {
                result = p;
            } else if (p) {
                result.push(p);
            } 
            // push to cache
            this.cache[path] = result;
        }
        return result;
    }
    
    setParam (path, value) {
        try {
            let obj = this.param;
            let i;
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++)
                 obj = obj[path[i]];
            obj[path[i]] = value;            
        } catch (err) 
        { 
            // do nothing
        };
    }
    
}

module.exports = new Context();