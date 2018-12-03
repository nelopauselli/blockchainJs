const Node = require('./../node');
const Wallet = require('./../wallet');

describe("Transacciones y fondos", function () {
    var node1, node2, node3;
    var wallet1 = new Wallet();
    var wallet2 = new Wallet();
    var wallet3 = new Wallet();

    beforeEach(function () {
        node1 = new Node("node-1", wallet1.address);
        node2 = new Node("node-2", wallet2.address, node1);
        node3 = new Node("node-3", wallet3.address, node1);

        wallet1.connectTo(node1);
        wallet2.connectTo(node1);
        wallet3.connectTo(node1);
    });

    it("Agrego de una transacción de una billetera sin fondos", function () {
        wallet3.sendTo(wallet2.address, 50);

        for (let node of [node1, node2, node3]) {
            node.processIncomingDocuments();
            expect(0).toBe(node.blockchain.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que no tiene suficientes fondos", function () {
        wallet1.sendTo(wallet2.address, 1000);

        for (let node of [node1, node2, node3]) {
            node.processIncomingDocuments();
            expect(0).toBe(node.blockchain.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que si tiene suficientes fondos", function () {
        wallet1.sendTo(wallet2.address, 50);

        for (let node of [node1, node2, node3]) {
            node.processIncomingDocuments();
            expect(1).toBe(node.blockchain.pendingDocuments.length);
        }
    });

    it("Doble gasto", function () {
        wallet1.sendTo(wallet2.address, 90);
        wallet1.sendTo(wallet3.address, 90);

        for (let node of [node1, node2, node3]) {
            node.processIncomingDocuments();
            expect(1).toBe(node.blockchain.pendingDocuments.length);

            expect(90).toBe(node.blockchain.getBalanceOfAddress(wallet2.address));
            expect(0).toBe(node.blockchain.getBalanceOfAddress(wallet3.address));
        }
    });

    it("Doble gasto después de minado", function () {
        wallet1.sendTo(wallet2.address, 90);
        wallet2.sendTo(wallet1.address, 50);
        node1.processIncomingDocuments();
        node1.mine();

        wallet2.sendTo(wallet3.address, 50);
        expect(1).toBe(node1.incomingDocuments.length);

        for (let node of [node1, node2, node3]) {
            node.processIncomingDocuments();
            expect(0).toBe(node.blockchain.pendingDocuments.length);

            expect(40).toBe(node.blockchain.getBalanceOfAddress(wallet2.address));
            expect(0).toBe(node.blockchain.getBalanceOfAddress(wallet3.address));
        }
    });
});