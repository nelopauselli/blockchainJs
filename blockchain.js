var Block = require("./block.js")
var MinerReward = require("./minerReward.js");
const Genesis = require("./genesis");
const uuid = require('uuid/v4');

class Blockchain {
    constructor(miner, difficulty) {
        this.miner = miner;
        this.pendingDocuments = [];
        this.difficulty = difficulty;
        this.miningReward = 100; // reward to miner

        this.chain = [];
    }

    createGenesisBlock() {
        this.add(new Genesis());
        this.minePendingTransaction(); // mine genesis block
    }

    find(document) {
        var other = this.pendingDocuments.find(d => d.id == document.id);
        return other;
    }

    add(document) {
        if (!document.isValid()){
            throw new Error("Documento inválido");
        }
        if (!document.id) document.id = uuid();
        this.pendingDocuments.push(document);
        return document;
    }

    setBlocks(blocks) {
        this.chain = blocks;
    }
    addBlock(block) {
        this.chain.push(block);

        // quitamos del pendiente todos los documentos incluidos en el bloque minado
        for (var document of block.documents) {
            this.pendingDocuments = this.pendingDocuments.filter(d => d.id != document.id);
        }
    }

    getBalanceOfAddress(account) {
        let balance = 0;
        for (const block of this.chain) {
            for (const document of block.documents) {
                if (document.from === account)
                    balance -= document.amount;
                else if (document.to === account)
                    balance += document.amount;
            }
        }

        for (const document of this.pendingDocuments) {
            if (document.from === account)
                balance -= document.amount;
            else if (document.to === account)
                balance += document.amount;
        }

        return balance;
    }

    minePendingTransaction() {
        if (this.pendingDocuments.length == 0) {
            console.log("no documents to mine");
            return;
        }

        var reward = new MinerReward(this.miner.account, this.miningReward);
        this.add(reward);

        console.log(`mining ${this.pendingDocuments.length} documents`);
        var last = this.getLatestBlock() || { index: -1, hash: "" };

        var block = new Block(Date.now(), this.pendingDocuments);
        block.index = last.index + 1;
        block.previousHash = last.hash;

        this.miner.mine(block, this.difficulty);

        console.log("Block mined!");
        this.chain.push(block);
        this.pendingDocuments = [];

        return block;
    }

    getLatestBlock() {
        return this.chain.length !== 0
            ? this.chain[this.chain.length - 1]
            : undefined;
    }

    isValid() {
        for (const block of this.chain) {
            if (!this.isValidBlock(block)) {
                return false;
            }
        }
        return true;
    }

    isValidBlock(block) {
        var previousBlock = this.chain[block.index - 1];
        if (previousBlock && previousBlock.index + 1 !== block.index) {
            console.log('invalid index');
            return false;
        } else if (previousBlock && previousBlock.hash !== block.previousHash) {
            console.log('invalid previoushash');
            return false;
        } else if (!block.isValid()) {
            console.log('invalid block');
            return false;
        }
        return true;
    }
}

module.exports = Blockchain;