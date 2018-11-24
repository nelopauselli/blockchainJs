class Transaction {
    constructor(from, to, ammount) {
        this.type = 'transaction';
        this.from = from;
        this.to = to;
        this.ammount = ammount;
    }
}

module.exports = Transaction;