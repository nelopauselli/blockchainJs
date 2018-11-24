const Node = require("./node");
const Transaction = require("./transaction");

// creando 2 nodos de la red
var node1 = new Node("nelo");
var node2 = new Node("pedro", node1);
var node3 = new Node("jose", node1);

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
for (let account of ["nelo", "pedro", "juan"]) {
    console.log(`the balance of '${account}' in 'node1' is ${node1.getBalanceOfAddress(account)}`);
    console.log(`the balance of '${account}' in 'node2' is ${node2.getBalanceOfAddress(account)}`);
}

// mostramos toda la blockchain desde el nodo3
for (let block of node3.blockchain.chain) {
    console.log(`block #${block.index}:`)
    for (let document of block.documents) {
        console.log(`\t${JSON.stringify(document)}`);
    }
}

// mostramos los bloques pendientes de minar
console.log(`pending documents:`)
for (let document of node3.blockchain.pendingDocuments) {
    console.log(`\t${JSON.stringify(document)}`);
}