const Node = require('./../node');
const Transaction = require('./../transaction');

describe("Transacciones y fondos", function () {
    var node1, node2, node3;

    beforeEach(function () {
        node1 = new Node("node-1");
        node2 = new Node("node-2", node1);
        node3 = new Node("node-3", node1);
    });

    it("Agrego de una transacción de una cuenta que no existe", function () {
        node1.add(new Transaction('ghost', 'nelo', 1000));

        for (let node of [node1, node2, node3]) {
            expect(0).toBe(node.blockchain.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que no tiene suficientes fondos", function () {
        node1.add(new Transaction('node-1', 'nelo', 1000));

        for (let node of [node1, node2, node3]) {
            expect(0).toBe(node.blockchain.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que si tiene suficientes fondos", function () {
        node1.add(new Transaction('node-1', 'nelo', 50));

        for (let node of [node1, node2, node3]) {
            expect(1).toBe(node.blockchain.pendingDocuments.length);
        }
    });
});