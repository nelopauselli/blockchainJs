var Blockchain = require("./blockchain.js");
var Miner = require("./builtInMiner");
var Peers = require("./peers");

class Node {

    constructor(accountRewards, peer) {
        this.id = accountRewards;
        this.blockchain = new Blockchain(new Miner(accountRewards), 2);

        this.peers = new Peers(this);
        if (peer) {
            this.peers.add(peer);
            this.peers.send(peer, { type: 'send me your blooks, please', startAt: 0, node: this });
        }
        else
            this.blockchain.createGenesisBlock();
    }

    add(document) {
        if (!this.blockchain.find(document)) {
            if (document.from) {
                var balance = this.blockchain.getBalanceOfAddress(document.from);
                if (balance < document.amount)
                    return;
            }
            console.log(`adding document ${JSON.stringify(document)} to blockchain of ${this.id}`);

            this.blockchain.add(document);

            let clone = JSON.parse(JSON.stringify(document));
            this.peers.broadcast({ type: 'new document', document: clone });
        }
    }

    // recibe un mensaje de otro nodo
    notify(message) {
        if (message.type === 'node added') {
            console.log(`register ${message.node.id} as new peer in ${this.id}`);
            this.peers.add(message.node);
        } else if (message.type == 'new document') {
            this.add(message.document);
        } else if (message.type == 'block mined') {
            this.blockchain.addBlock(message.block);
        } else if (message.type == 'send me your blooks, please') {
            var blocks = this.blockchain.chain.slice(message.startAt);
            this.peers.send(message.node, { type: 'my chain', blocks: blocks })
        } else if (message.type == 'my chain') {
            if (message.blocks && message.blocks.length > 0)
                this.blockchain.setBlocks(message.blocks);
        }
    }

    mine() {
        var block = this.blockchain.minePendingTransaction();
        if (block)
            this.peers.broadcast({ type: 'block mined', block: block });
    }

    getBalanceOfAddress(account) {
        return this.blockchain.getBalanceOfAddress(account);
    }
}

module.exports = Node;