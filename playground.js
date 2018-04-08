'use strict';


function setToValue(obj, value, path) {
    var i;
    path = path.split('.');
    for (i = 0; i < path.length - 1; i++) {
        if (!obj[path[i]]) obj[path[i]] = {}
        obj = obj[path[i]]
    }
    obj[path[i]] = value;
}

function getValue(obj, path, isArray) {
    let a = [];
    var i;
    path = path.split('.');
    for (i = 0; i < path.length; i++) {
        if (!obj[path[i]]) {obj = null; break;}
        obj = obj[path[i]]
    }
    if (isArray && !Array.isArray(obj)) { if (obj) a.push(obj); obj = a }
    return obj;
}


let r = {}
setToValue(r, 'allow', 'result.acl');
setToValue(r, 5, 'result.number.pos');

console.log(r)
console.log(getValue(r,"result.acl",true))
console.log(getValue(r,"result.acl",false))
console.log(getValue(r,"result.number.pos", true))
console.log(getValue(r,"result.number.pos"))
console.log(getValue(r,"result.dummy", true))
console.log(getValue(r,"result.dummy"))
console.log(r)

/*
class context {
    
    get ['gimmeFive']() { return 5; }
    //get: function() { return 5; }
    
    dynamic(name) {
        if (this['__'+name] && {}.toString.call(this['__'+name]) === '[object Function]') {
        //if (this['__'+name] === function) {
            return this['__'+name]('Hallo');
        } else {
            return ('Unkown function:' + name)
        }
    }
    
    __STRING (p) {
        return p
    }
    
    get param() { return this }
    get user() { return this ; }    
    get name() { return "name" ; }    
    
}

var c = new context;

console.log(c.dynamic('STRING'))
console.log(c.dynamic('NUMBER'))
*/

/*

var d1 = new Date();
var d2 = new Date(d1);

console.log(d1 == d2);   // prints false (wrong!) 
console.log(d1 === d2);  // prints false (wrong!)
console.log(d1 != d2);   // prints true  (wrong!)
console.log(d1 !== d2);  // prints true  (wrong!)
console.log(d1.getTime() == d2.getTime()); // prints true (correct)
console.log(d1.getTime() != d2.getTime()); // prints false (correct)
console.log(d1.getTime() >= d2.getTime()); // prints true (correct)
console.log(d1.getTime() <= d2.getTime()); // prints true (correct)
d1 = new Date();
d2 = new Date(d1+1);
console.log(d1.getTime() > d2.getTime()); // prints true (correct)
console.log(d1.getTime() <= d2.getTime()); // prints true (correct)


 # user.groups.name[..string]; user.id[string]; ressource.statuscode[number]; ressource.status[string] := 'status_'+ressource.statuscode; result.acl[string]
 @ user.groups.name :: 'group:5','group:1' && ressource.status :: 'published' => result.acl := 'allow'
 @ user.groups.name :: 'group:5','group:1' && ressource.status :: 'unpublished' => result.acl := 'allow'
 @ user.id :: ressource.owner => result.acl := 'allow'


*/
/*

--------------------------------------------------------------------------------------------------------------
Verketten
--------------------------------------------------------------------------------------------------------------
Ereignis: new Order 
> { order: "456789" }
Task: get Order 
< { order: "456789" }
> { order: "456789", items: [ { pos: "10", matnr: "4711", quantity: 5, deliveryDate: { requested: "2018-05-06" } }, { pos: "10", matnr: "0815", quantity: 7, deliveryDate: { requested: "2018-05-06" } }] }
Task: get Quantities / Dates
< { order: "456789", items: [ { pos: "10", matnr: "4711", quantity: 5, deliveryDate: { requested: "2018-05-06" } }, { pos: "10", matnr: "0815", quantity: 7, deliveryDate: { requested: "2018-05-06" } }] }
> { demands: [{ material: "4711", qty: 5, date: "2018-05-06" }, { material: "0815", qty: 7, date: "2018-05-06" }]}
Task: Loop over demands and call ATP check to get confirmations
< { demands: [{ material: "4711", qty: 5, date: "2018-05-06" }, { material: "0815", qty: 7, date: "2018-05-06" }]}
> { confirmed: [{ material: "4711", qty: 3, date: "2018-05-06" }, { material: "4711", qty: 2, date: "2018-05-11" }, { material: "0815", qty: 7, date: "2018-05-06" }]}

# #scope
# 

--------------------------------------------------------------------------------------------------------------
Transformieren
--------------------------------------------------------------------------------------------------------------
FROM:
var sales = [
  { "product" : "broiler", "store number" : 1, "quantity" : 20  },
  { "product" : "toaster", "store number" : 2, "quantity" : 100 },
  { "product" : "toaster", "store number" : 2, "quantity" : 50 },
  { "product" : "toaster", "store number" : 3, "quantity" : 50 },
  { "product" : "blender", "store number" : 3, "quantity" : 100 },
  { "product" : "blender", "store number" : 3, "quantity" : 150 },
  { "product" : "socks", "store number" : 1, "quantity" : 500 },
  { "product" : "socks", "store number" : 2, "quantity" : 10 },
  { "product" : "shirt", "store number" : 3, "quantity" : 10 }
];
var products = [
  { "name" : "broiler", "category" : "kitchen", "price" : 100, "cost" : 70 },
  { "name" : "toaster", "category" : "kitchen", "price" : 30, "cost" : 10 },
  { "name" : "blender", "category" : "kitchen", "price" : 50, "cost" : 25 },
  {  "name" : "socks", "category" : "clothes", "price" : 5, "cost" : 2 },
  { "name" : "shirt", "category" : "clothes", "price" : 10, "cost" : 3 }
];
var stores = [
  { "store number" : 1, "state" : "CA" },
  { "store number" : 2, "state" : "CA" },
  { "store number" : 3, "state" : "MA" },
  { "store number" : 4, "state" : "MA" }
];

[ { "CA": [ { "clothes": [ { "socks": "510 item(s) sold" } ] }, { "kitchen": [ { "broiler": "20 item(s) sold" }, { "toaster": "150 item(s) sold" } ] } ] }, { "MA": [ { "clothes": [ { "shirt": "10 item(s) sold" } ] }, { "kitchen": [ { "blender": "250 item(s) sold" }, { "toaster": "50 item(s) sold" } ] } ] } ]

per(stores.state).group {
 [stores.state] := per(products.cateogory).group {
    [products.cateogory] := per(sales.product).group.filter(sales.product == products.name && sales["store number"] == stores["store number"]) {
        [sales.product] := sum(sales.quantity) + "item(s) sold"
    }
 }
}
--------------------------------------------------------------------------------------------------------------
FROM:
store = {
  "store": "my store",
  "items": [
    {
      "name": "Hammer",
      "skus": [
        {
          "num": "12345qwert"
        }
      ]
    },
    {
      "name": "Bike",
      "skus": [
        {
          "num": "asdfghhj"
        },
        {
          "num": "zxcvbn"
        }
      ]
    },
    {
      "name": "Fork",
      "skus": [
        {
          "num": "0987dfgh"
        }
      ]
    }
  ]
}
TO:
[
  {
    "name": "Hammer",
    "sku": "12345qwert"
  },
  {
    "name": "Bike",
    "sku": "asdfghhj"
  },
  {
    "name": "Bike",
    "sku": "zxcvbn"
  },
  {
    "name": "Fork",
    "sku": "0987dfgh"
  }
]
per(store.items.skus.num) {
    name:= store.items.name
    sku:= store.items.skus.num
}

*/

