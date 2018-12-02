const Channel = require('./channel');

class Peers {
    constructor(node) {
        this.node = node;
        this.channels = [];
    }

    add(peer) {
        if (peer.alias != this.node.alias) {
            var other = this.channels.find(c => c.peer.alias == peer.alias);

            if (!other) {
                var channel = new Channel(peer);
                this.channels.push(channel);
                channel.send({ type: 'node added', node: this.node });
                this.broadcast({ type: 'node added', node: peer });
            }
        }
    }

    broadcast(message) {
        console.log(`broadcasting message from ${this.node.alias}`);
        for (let channel of this.channels) {
            console.log(`sending message to ${channel.peer.alias}`);

            channel.send(message);
        }
    }

    send(peer, message) {
        console.log(`sending message from ${this.node.alias} to ${peer.alias}`);
        let channel = this.channels.find(c => c.peer.alias == peer.alias);
        if (channel) {
            console.log(`sending message to ${channel.peer.alias}`);
            channel.send(message);
        } else {
            console.log(`channel not found from ${this.node.alias} to ${peer.alias}`);
        }
    }
}

module.exports = Peers;