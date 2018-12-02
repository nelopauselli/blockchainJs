const Node = require('./../node');
const Document = require('./../document');

describe("Nodos y Propagación", function () {
    var node1, node2, node3;

    beforeEach(function () {
        node1 = new Node("node-1", "123");
        node2 = new Node("node-2", "456", node1);
        node3 = new Node("node-3", "789", node1);
    });

    it("cuando agrego una transacción, esta es figura como pendiente en el nodo agregado", function () {
        node1.add(new Document('document test', 1234));

        expect(1).toBe(node1.blockchain.pendingDocuments.length);
        expect(1234).toBe(node1.blockchain.pendingDocuments[0].data);
    });

    it("cuando agrego una transacción, esta es propagada por los nodos", function () {
        node1.add(new Document('document test', 6584));

        for (let node of [node1, node2, node3]) {
            expect(1).toBe(node.blockchain.pendingDocuments.length);
            expect(6584).toBe(node.blockchain.pendingDocuments[0].data);
        }
    });


    it("cuando un documento se propaga por los nodos, conserva su ID", function () {
        var document = new Document('document test', 6584);
        node1.add(document);

        var documentId = document.id;
        for (let node of [node1, node2, node3]) {
            expect(documentId).toBe(node.blockchain.pendingDocuments[0].id);
        }
    });
})