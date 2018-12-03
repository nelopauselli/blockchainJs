var Block = require("./block.js")
var MinerReward = require("./minerReward.js");

class Blockchain {
    constructor(miner, difficulty) {
        this.miner = miner;
        this.difficulty = difficulty;
        this.miningReward = 100; // reward to miner

        this.chain = [];
    }

    setBlocks(blocks) {
        this.chain = blocks;
    }

    addBlock(block) {
        this.chain.push(block);
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

        return balance;
    }

    minePendingTransaction(pendingDocuments) {
        for (let document of pendingDocuments){
            if(!document.isValid()){
                throw new Error("Documento inválido");
            }
        }
        
        var reward = new MinerReward(this.miner.account, this.miningReward);
        pendingDocuments.push(reward);

        console.log(`mining ${pendingDocuments.length} documents`);
        var last = this.getLatestBlock() || { index: -1, hash: "" };

        var block = new Block(Date.now(), pendingDocuments);
        block.index = last.index + 1;
        block.previousHash = last.hash;

        this.miner.mine(block, this.difficulty);

        console.log("Block mined!");
        this.chain.push(block);

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