const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

const Transaction = require('./transaction');

class Wallet {
    constructor() {
        this.keys = ec.genKeyPair();
        this.address = this.keys.getPublic('hex');
    }

    sendTo(address, amount){
        var tx = new Transaction(this.address, address, amount);
        tx.sign(this.keys);

        return tx;
    }
}

module.exports = Wallet;