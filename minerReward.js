class MinerReward {
    constructor(account, ammount) {
        this.type = 'miner reward';
        this.to = account;
        this.ammount = ammount;
    }
}

module.exports = MinerReward;