var Transaction = require("./transaction")
var Account = require("./account");

class CriptoCoin {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.gift = 23; // gift to new accounts

        this.accounts = [];
    }

    createAccount(name) {
        var account = new Account(name, this.gift);
        this.accounts.push(account);

        this.blockchain.add({ type: 'create account', data: account });

        let transaction = new Transaction(null, account.name, this.gift);
        this.blockchain.add(transaction);

        return account;
    }
}

module.exports = CriptoCoin;