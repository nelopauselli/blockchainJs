var Blockchain = require("./blockchain.js");
var Miner = require("./builtInMiner");
var Peers = require("./peers");
var Transaction = require("./transaction");
var Document = require("./document");
var MinerReward = require("./minerReward");

class Node {

    constructor(alias, accountRewards, peer) {
        this.alias = alias;
        this.incomingDocuments = [];
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
        this.incomingDocuments.push(document);
    }

    processIncomingDocuments() {
        while (this.incomingDocuments.length > 0) {
            let document = this.incomingDocuments.shift();

            if (!this.blockchain.find(document)) {
                if (document.from) {
                    var balance = this.blockchain.getBalanceOfAddress(document.from);
                    if (balance < document.amount)
                        return;

                    console.log(`document is valid in blockchain of ${this.alias}`);
                }
                console.log(`adding document ${JSON.stringify(document)} to blockchain of ${this.alias}`);

                this.blockchain.add(document);

                let clone = JSON.parse(JSON.stringify(document));
                this.peers.broadcast({ type: 'new document', document: clone });
            }
        }
    }

    // recibe un mensaje de otro nodo
    notify(message) {
        if (message.type === 'node added') {
            console.log(`register ${message.node.alias} as new peer in ${this.alias}`);
            this.peers.add(message.node);
        } else if (message.type == 'new document') {
            var document;
            if (message.document.type == 'transaction') {
                document = Object.assign(new Transaction, message.document);
            } else if (message.document.type == 'document') {
                document = Object.assign(new Document, message.document);
            } else if (message.document.type == 'miner') {
                document = Object.assign(new MinerReward, message.document);
            } else {
                throw new Error(`No se reconoce el tipo de documento ${message.document.type}`);
            }
            this.add(document);
        } else if (message.type == 'block mined') {
            var block = message.block;
            for (var document of block.documents) {
                this.incomingDocuments = this.incomingDocuments.filter(d => d.id != document.id);
            }
            this.blockchain.addBlock(block);
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