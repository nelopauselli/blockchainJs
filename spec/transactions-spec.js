const Node = require('./../node');
const Wallet = require('./../wallet');

describe("Transacciones y fondos", function () {
    var node1, node2, node3;
    var walletMiner = new Wallet();
    var wallet1 = new Wallet();
    var wallet2 = new Wallet();
    var wallet3 = new Wallet();

    beforeEach(function () {
        node1 = new Node("node-1", walletMiner.address);
        node2 = new Node("node-2", walletMiner.address, node1);
        node3 = new Node("node-3", walletMiner.address, node1);

        walletMiner.connectTo(node1);
        wallet1.connectTo(node1);
        wallet2.connectTo(node1);
        wallet3.connectTo(node1);

        walletMiner.sendTo(wallet1.address, 100);
        node1.processIncomingDocuments();
        node1.mine();
    });

    it("Agrego de una transacción de una billetera sin fondos", function () {
        wallet3.sendTo(wallet2.address, 50);

        for (let node of [node1, node2, node3]) {
            node.processIncomingDocuments();
            expect(0).toBe(node.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que no tiene suficientes fondos", function () {
        wallet1.sendTo(wallet2.address, 1000);

        for (let node of [node1, node2, node3]) {
            node.processIncomingDocuments();
            expect(0).toBe(node.pendingDocuments.length);
        }
    });

    it("Agrego de una transacción de una cuenta que si tiene suficientes fondos", function () {
        wallet1.sendTo(wallet2.address, 50);

        for (let node of [node1, node2, node3]) {
            node.processIncomingDocuments();
            expect(1).toBe(node.pendingDocuments.length);
        }
    });

    it("Doble gasto", function () {
        wallet1.sendTo(wallet2.address, 90);
        wallet1.sendTo(wallet3.address, 90);

        node1.processIncomingDocuments();
        expect(1).toBe(node1.pendingDocuments.length);
        expect(90).toBe(node1.getBalanceOfAddress(wallet2.address));
        expect(0).toBe(node1.getBalanceOfAddress(wallet3.address));

        node2.processIncomingDocuments();
        expect(1).toBe(node2.pendingDocuments.length);
        expect(90).toBe(node2.getBalanceOfAddress(wallet2.address));
        expect(0).toBe(node2.getBalanceOfAddress(wallet3.address));

        node3.processIncomingDocuments();
        expect(1).toBe(node3.pendingDocuments.length);
        expect(90).toBe(node3.getBalanceOfAddress(wallet2.address));
        expect(0).toBe(node3.getBalanceOfAddress(wallet3.address));
    });

    it("Doble gasto cambiando de nodo", function () {
        wallet1.sendTo(wallet2.address, 90);
        wallet1.connectTo(node2);
        wallet1.sendTo(wallet3.address, 90);

        expect(100).toBe(node1.getBalanceOfAddress(wallet1.address));
        expect(0).toBe(node1.getBalanceOfAddress(wallet2.address));
        expect(0).toBe(node1.getBalanceOfAddress(wallet3.address));

        expect(100).toBe(node2.getBalanceOfAddress(wallet1.address));
        expect(0).toBe(node2.getBalanceOfAddress(wallet2.address));
        expect(0).toBe(node2.getBalanceOfAddress(wallet3.address));

        expect(100).toBe(node3.getBalanceOfAddress(wallet1.address));
        expect(0).toBe(node3.getBalanceOfAddress(wallet2.address));
        expect(0).toBe(node3.getBalanceOfAddress(wallet3.address));

        node2.processIncomingDocuments();
        node2.mine();

        expect(10).toBe(node1.getBalanceOfAddress(wallet1.address));
        expect(0).toBe(node1.getBalanceOfAddress(wallet2.address));
        expect(90).toBe(node1.getBalanceOfAddress(wallet3.address));

        expect(10).toBe(node2.getBalanceOfAddress(wallet1.address));
        expect(0).toBe(node2.getBalanceOfAddress(wallet2.address));
        expect(90).toBe(node2.getBalanceOfAddress(wallet3.address));

        expect(10).toBe(node3.getBalanceOfAddress(wallet1.address));
        expect(0).toBe(node3.getBalanceOfAddress(wallet2.address));
        expect(90).toBe(node3.getBalanceOfAddress(wallet3.address));
    });

    it("Doble gasto después de minado", function () {
        wallet1.sendTo(wallet2.address, 90);
        wallet2.sendTo(wallet1.address, 50);
        
        node1.processIncomingDocuments();
        node1.mine();

        wallet2.sendTo(wallet3.address, 50);
        expect(1).toBe(node1.incomingDocuments.length);

        for (let node of [node1, node2, node3]) {
            expect(0).toBe(node.pendingDocuments.length);
            expect(40).toBe(node.getBalanceOfAddress(wallet2.address));
            expect(0).toBe(node.getBalanceOfAddress(wallet3.address));
        }
    });
});