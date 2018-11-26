class Channel {
    constructor(peer) {
        this.peer = peer;
    }

    send(message){
        this.peer.notify(message);
    }
}

module.exports = Channel;