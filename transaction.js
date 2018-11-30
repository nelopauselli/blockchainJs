const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(from, to, amount, signature) {
        this.type = 'transaction';
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.signature = signature;
    }

    calculateHash() {
        return SHA256(this.from, this.to + this.amount).toString();
    }

    sign(signingKey) {
        if (signingKey.getPublic('hex') !== this.from)
            throw new Error("No se pueden firmar transacciones de otra billetera!");

        var hash = this.calculateHash();
        this.signature = signingKey.sign(hash, 'base64').toDER('hex');
    }

    isValid() {
        if (!this.from || !this.to || !this.amount)
            return false;

        if (!this.signature || this.signature.length === 0)
            return false;

        const publicKey = ec.keyFromPublic(this.from, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

module.exports = Transaction;