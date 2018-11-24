var Node = require("./blockchainNode");

var node1 = new Node("nelo");
var node2 = new Node("pedro", node1);

node1.add({ type: 'transaction', from: "nelo", to: "juan", ammount: 23 });
node2.add({ type: 'transaction', from: "nelo", to: "pedro", ammount: 17 });

node1.mine();


console.log(`the balance of 'nelo' in 'node1' is ${node1.getBalanceOfAddress('nelo')}`);
console.log(`the balance of 'nelo' in 'node2' is ${node2.getBalanceOfAddress('nelo')}`);