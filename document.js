class Document {
    constructor(text, data) {
        this.type = 'document';
        this.text = text;
        this.data = data;
    }

    isValid(){
        return true;
    }
}

module.exports = Document;