const Node = require('./../node');
const Document = require('./../document');

describe("Nodos y Minado", function () {
    var node1, node2, node3;

    beforeEach(function () {
        node1 = new Node("node-1", "123");
        node2 = new Node("node-2", "456", node1);
        node3 = new Node("node-3", "789", node1);
    });

    it("Minado de una transacción", function () {
        node1.add(new Document('document test', 1234));
        node1.processIncomingDocuments();

        node1.mine();

        expect(0).toBe(node1.blockchain.pendingDocuments.length);
        expect(2).toBe(node1.blockchain.chain.length); // genesis block + mined block
        expect(2).toBe(node1.blockchain.chain[1].documents.length); // document test + mined rewards
        expect(1234).toBe(node1.blockchain.chain[1].documents[0].data);
    });

    it("cuando mino una transacción, esta es propagada por los nodos", function () {
        node1.add(new Document('document test', 6584));
        node1.processIncomingDocuments();
        node1.mine();

        for (let node of [node1, node2, node3]) {
            expect(0).toBe(node.incomingDocuments.length);
            expect(0).toBe(node.blockchain.pendingDocuments.length);
            expect(2).toBe(node.blockchain.chain.length); // genesis block + mined block
            expect(2).toBe(node.blockchain.chain[1].documents.length); // document test + mined rewards
            expect(6584).toBe(node.blockchain.chain[1].documents[0].data);
            expect(true).toBe(node.blockchain.isValid())
        }
    });
})