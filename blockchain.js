var Block = require("./block.js")
var Transaction = require("./transaction.js")
var Account = require("./account.js");
var Miner = require("./miner.js");

class Blockchain {
    constructor(difficulty) {
        this.accounts = [];
        this.miners = [];
        this.pendingTransactions = [];
        this.difficulty = difficulty;
        this.miningReward = 100; // reward to miner
        this.gift = 23; // gift to new accounts

        this.chain = [this.generateGenesisBlock()];
    }

    generateGenesisBlock() {
        let block = new Block(Date.now(), "genesis block");
        block.index = 0;

        var miner = new Miner(null);
        miner.mine(block, this.difficulty);

        console.log("genesis block mined!");
        return block;
    }

    attachMiner(miner) {
        this.miners.push(miner);
    }

    createAccount(name) {
        var account = new Account(name);
        this.accounts.push(account);

        this.createTransaction(null, account.name, this.gift)
        return account;
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

        for (let miner of this.miners)
            miner.mine(block, this.difficulty);

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