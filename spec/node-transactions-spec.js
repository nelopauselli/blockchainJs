const Node = require('./../node');

describe("Nodos y Transacciones", function () {
    var node1, node2, node3;

    beforeEach(function () {
        node1 = new Node("node-1");
        node2 = new Node("node-2", node1);
        node3 = new Node("node-3", node1);
    });

    it("cuando agrego una transacción, esta es figura como pendiente en el nodo agregado", function () {
        node1.add({ type: 'document test', data: 1234 });

        expect(1).toBe(node1.blockchain.pendingDocuments.length);
        expect(1234).toBe(node1.blockchain.pendingDocuments[0].data);
    });

    it("cuando agrego una transacción, esta es propagada por los nodos", function () {
        node1.add({ type: 'document test', data: 6584 });

        expect(1).toBe(node1.blockchain.pendingDocuments.length);
        expect(6584).toBe(node1.blockchain.pendingDocuments[0].data);

        expect(1).toBe(node2.blockchain.pendingDocuments.length);
        expect(6584).toBe(node2.blockchain.pendingDocuments[0].data);

        expect(1).toBe(node3.blockchain.pendingDocuments.length);
        expect(6584).toBe(node3.blockchain.pendingDocuments[0].data);
    });
})