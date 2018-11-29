class Transaction {
    constructor(from, to, ammount) {
        this.type = 'transaction';
        this.from = from;
        this.to = to;
        this.ammount = ammount;
    }

    isValid(){
        return true;
    }
}

module.exports = Transaction;