class BuiltInMiner {
    constructor(account) {
        this.account = account;
    }

    mine(block, difficulty) {
        const zeros = Array(difficulty + 1).join("0");

        while (!block.hash || block.hash.substring(0, difficulty) !== zeros) {
            block.nonce++;
            block.hash = block.calculateHash();
        }

        return block;
    }
}

module.exports = BuiltInMiner;