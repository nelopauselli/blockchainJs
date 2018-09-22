var Block = require("./block.js")
var Transaction = require("./transaction.js")

class Blockchain {
    constructor(difficulty) {
        this.pendingTransactions = [];
        this.difficulty = difficulty;
        this.miningReward = 100;

        this.chain = [this.generateGenesisBlock()];
    }

    generateGenesisBlock() {
        let block = new Block(Date.now(), "genesis block");
        block.index = 0;
        block.mine(this.difficulty);

        return block;
    }

    createTransaction(from, to, ammount) {
        let transaction = new Transaction(from, to, ammount);
        this.pendingTransactions.push(transaction);

        console.log('transaction added: ' + JSON.stringify(transaction));

        return transaction;
    }

    getBalanceOfAddress(account) {
        let balance = 0;
        for (const block of this.chain.slice(1)) {
            for (const transaction of block.data) {
                if (transaction.from === account)
                    balance -= transaction.ammount;
                else if (transaction.to === account)
                    balance += transaction.ammount;
            }
        }
        return balance;
    }

    minePendingTransaction(miningRewardAddress) {
        console.log(`mining ${this.pendingTransactions.length} transactions`);

        var block = new Block(Date.now(), this.pendingTransactions);

        var last = this.getLatestBlock() || { index: -1, hash: "" };

        block.index = last.index + 1;
        block.previousHash = last.hash;

        block.mine(this.difficulty);

        console.log("Block mined!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

        return block;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    isValid(){
        for(const block of this.chain){
            if(!this.isValidBlock(block)){
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