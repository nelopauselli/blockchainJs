var CryptoJS = require('crypto-js');

class Block {
    constructor(timestamp, documents) {
        this.index = null;
        this.previousHash = null;
        this.timestamp = timestamp;
        this.documents = documents;
        this.nonce = 0;
        this.hash = null;
    }

    calculateHash() {
        var middle = CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.documents) + this.nonce).toString();
        var hash = CryptoJS.SHA256(middle).toString();
        return hash;
    }

    isValid() {
        if (this.calculateHash() !== this.hash)
            return false;

        if (this.documents.find(d => !d.isValid()))
            return false;

        return true;
    }
}

module.exports = Block;