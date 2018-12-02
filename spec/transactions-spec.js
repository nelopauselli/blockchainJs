const Node = require('./../node');
const Wallet = require('./../wallet');

describe("Transacciones y fondos", function () {
    var node1, node2, node3;
    var wallet1 = new Wallet();
    var wallet2 = new Wallet();
    var wallet3 = new Wallet();

    beforeEach(function () {
        node1 = new Node("node-1", wallet1.address);
        node2 = new Node("node-2", wallet2, node1);
        node3 = new Node("node-3", wallet3, node1);

        wallet1.connectTo(node1);
        wallet2.connectTo(node1);
        wallet3.connectTo(node1);
    });

    it("Agrego de una transacción de una cuenta que no existe", function () {
        wallet3.sendTo(wallet2.address, 50);

        for (let node of [node1, node2, node3]) {
            expect(0).toBe(node.blockchain.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que no tiene suficientes fondos", function () {
        wallet1.sendTo(wallet2.address, 1000);

        for (let node of [node1, node2, node3]) {
            expect(0).toBe(node.blockchain.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que si tiene suficientes fondos", function () {
        wallet1.sendTo(wallet2.address, 50);

        for (let node of [node1, node2, node3]) {
            expect(1).toBe(node.blockchain.pendingDocuments.length);
        }
    });
});