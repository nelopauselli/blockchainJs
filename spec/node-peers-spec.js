const Node = require('./../node');

describe("Conexión entre Nodos", function(){
    it("cuando creo dos nodos, estos están conectados", function(){
        var node1 = new Node("node-1");
        var node2 = new Node("node-2", node1);

        expect(1).toBe(node1.peers.channels.length);
        expect("node-2").toBe(node1.peers.channels[0].peer.id);
        
        expect(1).toBe(node2.peers.channels.length);
        expect("node-1").toBe(node2.peers.channels[0].peer.id);
    });

    it("cuando creo tres nodos, estos están conectados", function () {
        var node1 = new Node("node-1");
        var node2 = new Node("node-2", node1);
        var node3 = new Node("node-3", node1);

        expect(2).toBe(node1.peers.channels.length);
        expect("node-2").toBe(node1.peers.channels[0].peer.id);
        expect("node-3").toBe(node1.peers.channels[1].peer.id);

        expect(2).toBe(node2.peers.channels.length);
        expect("node-1").toBe(node2.peers.channels[0].peer.id);
        expect("node-3").toBe(node2.peers.channels[1].peer.id);

        expect(2).toBe(node3.peers.channels.length);
        expect("node-1").toBe(node3.peers.channels[0].peer.id);
        expect("node-2").toBe(node3.peers.channels[1].peer.id);
    })
})