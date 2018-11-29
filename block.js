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

        if (this.documents.some(d => !this.isValidDocument(d)))
            return false;

        return true;
    }

    isValidDocument(document){
        if (document.type =='miner reward' && document.index == 0)
            return true;
        
        return true;
    }
}

module.exports = Block;