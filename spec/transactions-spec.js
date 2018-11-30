const Node = require('./../node');
const Wallet = require('./../wallet');

describe("Transacciones y fondos", function () {
    var node1, node2, node3;
    var wallet1 = new Wallet("fe75beff4e1ce28e8e6555adee7acfed47ce58be338ff95addb8e2371d262b2d");
    var wallet2 = new Wallet("841dc0dacfebc2372aba0d22af1a3455f63501bf53c7b3bfa91b0e117a43e0c6");
    var wallet3 = new Wallet("d7b32f17f88fdb02b64ac3f9986508a7207ab6bf399257761e9264009c489280");

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