class MinerReward {
    constructor(account, ammount) {
        this.type = 'miner reward';
        this.data = {
            to: account,
            ammount: ammount
        };
    }
}

module.exports = MinerReward;