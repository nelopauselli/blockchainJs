var Block = require("./block.js")
var Miner = require("./miner.js");
var MinerReward = require("./minerReward.js");

class Blockchain {
    constructor(difficulty) {
        this.miners = [];
        this.pendingDocuments = [];
        this.difficulty = difficulty;
        this.miningReward = 100; // reward to miner

        this.chain = [];

        this.add({ type: 'genesis block' })
    }

    attachMiner(miner) {
        this.miners.push(miner);
    }

    add(document) {
        this.pendingDocuments.push(document);

        console.log('document added: ' + JSON.stringify(document));

        return document;
    }

    getBalanceOfAddress(account) {
        let balance = 0;
        for (const block of this.chain) {
            for (const document of block.documents) {
                if (document.data) {
                    if (document.data.from === account)
                        balance -= document.data.ammount;
                    else if (document.data.to === account)
                        balance += document.data.ammount;
                }
            }
        }
        return balance;
    }

    minePendingTransaction(miningRewardAddress) {
        console.log(`mining ${this.pendingDocuments.length} chunks`);

        var block = new Block(Date.now(), this.pendingDocuments);

        var last = this.getLatestBlock() || { index: -1, hash: "" };

        block.index = last.index + 1;
        block.previousHash = last.hash;

        let miner = this.miners[0];
        miner.mine(block, this.difficulty);

        console.log("Block mined!");
        this.chain.push(block);
        this.pendingDocuments = [];

        console.log(miner);
        var reward = new MinerReward(miner.account.name, this.miningReward);
        this.add(reward);

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
        } else if (block.calculateHash() !== block.hash) {
            console.log('invalid hash: ' + block.calculateHash() + ' ' + block.hash);
            return false;
        }
        return true;
    }
}

module.exports = Blockchain;