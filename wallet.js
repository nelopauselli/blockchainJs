const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

const Transaction = require('./transaction');

class Wallet {
    constructor() {
        this.keys = ec.genKeyPair();
        this.address = this.keys.getPublic('hex');
    }

    connectTo(node) {
        this.node = node;
    }

    sendTo(address, amount) {
        if(!this.node){
            throw new Error("La billetera no está conectada a ningún nodo");
        }

        var tx = new Transaction(this.address, address, amount);
        tx.sign(this.keys);

        this.node.add(tx);
    }
}

module.exports = Wallet;