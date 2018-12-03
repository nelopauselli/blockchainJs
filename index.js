const Node = require("./node");
const Wallet = require("./wallet");

// creando billeteras
var walletNelo = new Wallet();
var walletPedro = new Wallet();
var walletJuan = new Wallet();
var walletJose = new Wallet();

// creando 3 nodos de la red
var node1 = new Node("nodo-1", walletNelo.address);
var node2 = new Node("nodo-2", walletPedro.address, node1); // le pasamos 1 peer donde acoplarse a la red
var node3 = new Node("nodo-3", walletJuan.address, node1); // le pasamos 1 peer donde acoplarse a la red

// conectamos las billeteras a algún nodo de la red
walletNelo.connectTo(node1);
walletPedro.connectTo(node1);
walletJuan.connectTo(node1);
walletJose.connectTo(node1);

// agregando transacciones a la red por distintos nodos
walletNelo.sendTo(walletJuan.address, 23);
walletNelo.sendTo(walletPedro.address, 17);

node1.processIncomingDocuments();
node1.mine(); // mina tanto los bloques que entraron por nodo-1 como por nodo-2

node2.processIncomingDocuments();
node2.mine(); // no debería minar nada porque ya minó el nodo-1

walletPedro.sendTo(walletJuan.address, 10);
walletPedro.sendTo(walletJose.address, 2);
node2.processIncomingDocuments();
node2.mine(); // mina la transacción que acaba de entrar por el nodo-1

// agregamos una transacción que no será minada
walletJuan.sendTo(walletNelo.address, 1);

// recorremos las cuentas y mostramos el balance en uno y otro nodo. Debería ser el mismo
for (let account of [walletNelo.address, walletPedro.address, walletJuan.address, walletJose.address, "rewards-stock"]) {
    for (let node of [node1, node2, node3]) {
        console.log(`the balance of '${account}' in '${node.alias}' is ${node.getBalanceOfAddress(account)}`);
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
    console.log('-----');
}

// mostramos los documentos entrantes pendientes de procesar
for (let node of [node1, node2, node3]) {
    console.log(`incoming documents in ${node.alias}: ${node.incomingDocuments.length}`)
}

// mostramos los documentos pendientes de minar
for (let node of [node1, node2, node3]) {
    console.log(`pending documents in ${node.alias}: ${node.pendingDocuments.length}`)
}

// mostramos los documentos minados
for (let node of [node1, node2, node3]) {
    let count = 0;
    for (let block of node.blockchain.chain) {
        count += block.documents.length;
    }
    console.log(`mined documents in ${node.alias}: ${count}`)
}