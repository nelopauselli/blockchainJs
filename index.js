const Node = require("./node");
const Transaction = require("./transaction");

// creando 3 nodos de la red
var node1 = new Node("nelo");
var node2 = new Node("pedro", node1); // le pasamos 1 peer donde acoplarse a la red
var node3 = new Node("jose", node1); // le pasamos 1 peer donde acoplarse a la red

// agregando transacciones a la red por distintos nodos
node1.add(new Transaction("nelo", "juan", 23));
node2.add(new Transaction("nelo", "pedro", 17));

node1.mine(); // mina tanto los bloques que entraron por nodo-1 como por nodo-2
node2.mine(); // no debería minar nada porque ya minó el nodo-1

node1.add(new Transaction("pedro", "juan", 10));
node2.mine(); // mina la transacción que acaba de entrar por el nodo-1

// agregamos una transacción que no será minada
node1.add(new Transaction("juan", "nelo", 1));

// recorremos las cuentas y mostramos el balance en uno y otro nodo. Debería ser el mismo
for (let account of ["nelo", "pedro", "juan", "jose", "rewards-stock"]) {
    for (let node of [node1, node2, node3]) {
        console.log(`the balance of '${account}' in '${node.id}' is ${node.getBalanceOfAddress(account)}`);
    }
}

// mostramos toda la blockchain desde el nodo3
console.log('-----')
for (let block of node3.blockchain.chain) {
    console.log(`block #${block.index} (previousHash: ${block.previousHash || "null"}): [`)
    for (let document of block.documents) {
        console.log(`\t${JSON.stringify(document)}`);
    }
    console.log(`] => hash: ${block.hash}`);
    console.log('-----')
}

// mostramos los bloques pendientes de minar
console.log(`pending documents:`)
for (let document of node3.blockchain.pendingDocuments) {
    console.log(`\t${JSON.stringify(document)}`);
}