class MinerReward {
    constructor(account, amount) {
        this.type = 'miner reward';
        this.from = 'rewards-stock';
        this.to = account;
        this.amount = amount;
    }

    isValid(){
        return true;
    }
}

module.exports = MinerReward;