const Node = require("./blockchainNode");
const Transaction = require("./transaction");

var node1 = new Node("nelo");
var node2 = new Node("pedro", node1);

node1.add(new Transaction("nelo", "juan", 23));
node2.add(new Transaction("nelo", "pedro", 17));

node1.mine(); // mina tanto los bloques que entraron por nodo-1 como por nodo-2
node2.mine(); // no debería minar nada porque ya minó el nodo-1

node1.add(new Transaction("pedro", "juan", 10));
node2.mine(); // mina la transacción que acaba de entrar por el nodo-1

for(let account of ["nelo", "pedro", "juan"]){
    console.log(`the balance of '${account}' in 'node1' is ${node1.getBalanceOfAddress(account)}`);
    console.log(`the balance of '${account}' in 'node2' is ${node2.getBalanceOfAddress(account)}`);
}

for (let block of node1.blockchain.chain) {
    for (let document of block.documents){
        console.log(document);
    }
}