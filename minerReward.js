class MinerReward {
    constructor(account, ammount) {
        this.type = 'miner reward';
        this.from = 'rewards-stock';
        this.to = account;
        this.ammount = ammount;
    }
}

module.exports = MinerReward;