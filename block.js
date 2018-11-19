var CryptoJS = require('crypto-js');

class Block {
    constructor(timestamp, documents) {
        this.index = null;
        this.previousHash = null;
        this.timestamp = timestamp;
        this.documents = documents;
        this.key = 0;
        this.hash = null;
    }

    calculateHash() {
        var middle = CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.documents) + this.key).toString();
        var hash = CryptoJS.SHA256(middle).toString();
        return hash;
    }
}

module.exports = Block;