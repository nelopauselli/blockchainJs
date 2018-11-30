const Node = require('./../node');
const Wallet = require('./../wallet');

describe("Transacciones y fondos", function () {
    var node1, node2, node3;
    var wallet1 = new Wallet();
    var wallet2 = new Wallet();
    var wallet3 = new Wallet();

    beforeEach(function () {
        node1 = new Node(wallet1.address);
        node2 = new Node(wallet2, node1);
        node3 = new Node(wallet3, node1);
    });

    it("Agrego de una transacción de una cuenta que no existe", function () {
        node1.add(wallet3.sendTo(wallet2, 50));

        for (let node of [node1, node2, node3]) {
            expect(0).toBe(node.blockchain.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que no tiene suficientes fondos", function () {
        node1.add(wallet1.sendTo(wallet2, 1000));

        for (let node of [node1, node2, node3]) {
            expect(0).toBe(node.blockchain.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que si tiene suficientes fondos", function () {
        node1.add(wallet1.sendTo(wallet2, 50));

        for (let node of [node1, node2, node3]) {
            expect(1).toBe(node.blockchain.pendingDocuments.length);
        }
    });
});