let user = {
    groups: []
}

for(let n=0; n<4; n++) {
    let g = {
        id: "G"+n,
        name: "group:"+n,
    }
    user.groups.push(g);
}

let ressource = {
    id: "R0001",
    status: "published",
    folders: [500, 600, 700]
}
let operation = {
    type: "write"
}

module.exports.acl = {
        user: user,
        ressource: ressource,
        operation: operation,
        result: {}
       };