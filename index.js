const Node = require("./blockchainNode");
const Transaction = require("./transaction");

var node1 = new Node("nelo");
var node2 = new Node("pedro", node1);

node1.add(new Transaction("nelo", "juan", 23));
node1.add(new Transaction("nelo", "pedro", 17));

node1.mine();


console.log(`the balance of 'nelo' in 'node1' is ${node1.getBalanceOfAddress('nelo')}`);
console.log(`the balance of 'nelo' in 'node2' is ${node2.getBalanceOfAddress('nelo')}`);