const Node = require('./../node');
const Document = require('./../document');

describe("Nodos y Propagación", function () {
    var node1, node2, node3;

    beforeEach(function () {
        node1 = new Node("node-1", "123");
        node2 = new Node("node-2", "456", node1);
        node3 = new Node("node-3", "789", node1);
    });

    it("cuando agrego una transacción, esta es figura como entrante en el nodo agregado y no propagada a otros nodos", function () {
        node1.add(new Document('document test', 1234));

        expect(1).toBe(node1.incomingDocuments.length);
        expect(1234).toBe(node1.incomingDocuments[0].data);

        expect(0).toBe(node2.incomingDocuments.length);
        expect(0).toBe(node3.incomingDocuments.length);
    });

    it("cuando confirmo una transacción, esta es figura como pendiente en el nodo agregado", function () {
        node1.add(new Document('document test', 1234));

        node1.processIncomingDocuments();

        expect(0).toBe(node1.incomingDocuments.length);

        expect(1).toBe(node1.pendingDocuments.length);
        expect(1234).toBe(node1.pendingDocuments[0].data);
    });
    
    it("cuando confirmo una transacción, esta es figura como entrante en los nodos conectados al entrante", function () {
        node1.add(new Document('document test', 1234));

        node1.processIncomingDocuments();

        expect(1).toBe(node2.incomingDocuments.length);
        expect(1234).toBe(node2.incomingDocuments[0].data);
        expect(0).toBe(node2.pendingDocuments.length);

        expect(1).toBe(node3.incomingDocuments.length);
        expect(1234).toBe(node3.incomingDocuments[0].data);
        expect(0).toBe(node3.pendingDocuments.length);
    });

    it("cuando agrego una transacción, esta es propagada por los nodos e incorporada a su blockchain a medida que se procesa", function () {
        node1.add(new Document('document test', 6584));

        node1.processIncomingDocuments();
        node2.processIncomingDocuments();
        node3.processIncomingDocuments();

        for (let node of [node1, node2, node3]) {
            expect(1).toBe(node.pendingDocuments.length);
            expect(6584).toBe(node.pendingDocuments[0].data);
        }
    });


    it("cuando un documento se propaga por los nodos, conserva su ID", function () {
        var document = new Document('document test', 6584);
        node1.add(document);

        node1.processIncomingDocuments();
        node2.processIncomingDocuments();
        node3.processIncomingDocuments();

        var documentId = document.id;
        for (let node of [node1, node2, node3]) {
            expect(documentId).toBe(node.pendingDocuments[0].id);
        }
    });
})