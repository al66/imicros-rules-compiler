let user = {
    groups: [
        {
            id: "0001",
            name: "my group"    
        },
        {
            id: "0002",
            name: "SAP Support"
        }
    ]
}

for(let n=0; n<2; n++) {
    let g = {
        id: "G"+n,
        name: "group:"+n,
    }
    user.groups.push(g);
}

let ressource = {
    id: "R0001",
    status: "published"
}
let operation = {
    type: "write"
}

module.exports.acl = {
        user: user,
        ressource: ressource,
        operation: operation,
       };