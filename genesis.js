class Genesis {
    constructor() {
        this.type = 'genesis';
        this.from = 'genesis';
        this.to = 'rewards-stock';
        this.ammount = 21000000;
    }

    isValid(){
        return true;
    }
}

module.exports = Genesis;
