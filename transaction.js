class Transaction {
    constructor(from, to, ammount) {
        this.type = 'transaction';
        this.data = {
            from: from,
            to: to,
            ammount: ammount
        };
    }
}

module.exports = Transaction;