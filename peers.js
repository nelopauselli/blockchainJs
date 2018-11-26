const Channel = require('./channel');

class Peers {
    constructor(node) {
        this.node = node;
        this.channels = [];
    }

    add(peer) {
        if (peer.id != this.node.id) {
            var other = this.channels.find(c => c.peer.id == peer.id);

            if (!other) {
                var channel = new Channel(peer);
                this.channels.push(channel);
                channel.send({ type: 'node added', node: this.node });
                this.broadcast({ type: 'node added', node: peer });
            }
        }
    }

    broadcast(message) {
        console.log(`broadcasting message from ${this.node.id}`);
        for (let channel of this.channels) {
            console.log(`sending message to ${channel.peer.id}`);
            channel.send(message);
        }
    }

    send(peer, message) {
        console.log(`sending message from ${this.node.id} to ${peer.id}`);
        let channel = this.channels.find(c => c.peer.id == peer.id);
        if (channel) {
            console.log(`sending message to ${channel.id}`);
            channel.send(message);
        } else {
            console.log(`channel not found from ${this.node.id} to ${peer.id}`);
        }
    }
}

module.exports = Peers;