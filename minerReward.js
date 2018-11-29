class MinerReward {
    constructor(account, ammount) {
        this.type = 'miner reward';
        this.from = 'rewards-stock';
        this.to = account;
        this.ammount = ammount;
    }

    isValid(){
        return true;
    }
}

module.exports = MinerReward;