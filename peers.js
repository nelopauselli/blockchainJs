class Peers {
    constructor(node) {
        this.node = node;

        this.peers = [];
        this.count = 0;
    }

    add(peer) {
        var self = this;

        if (peer.id != this.node.id) {
            var other = this.peers.find(p => p.id == peer.id);

            if (!other) {
                this.peers.push(peer);
                peer.notify({ type: 'node added', node: this.node });
                this.broadcast({ type: 'node added', node: peer });
                peer.getBlocks(0, function (blocks) {
                    if (blocks && blocks.length > 0)
                        self.node.blockchain.setBlocks(blocks);
                });
            }
        }
    }

    broadcast(message) {
        console.log(`broadcasting message from ${this.node.id}`);
        for (let peer of this.peers) {
            console.log(`sending message to ${peer.id}`);
            peer.notify(message);
        }
    }
}

module.exports = Peers;