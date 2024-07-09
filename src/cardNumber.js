const BaseConverter = require('./baseConverter');
const banks = require('./banks.json');

class CardNumber {
    constructor(input) {
        if (/^[0-9]+$/.test(input)) {
            this.number = input;
            this.encoded = this.encode();
        } else {
            this.number = this.decode();
            this.encoded = input;
        }

        if (!card.isValid()) {
            throw new Error('Invalid card number');
        }
    }

    encode() {
        return this.encoded ? this.encoded : BaseConverter.base10ToBase62(this.number);
    }

    decode() {
        return this.number ? this.number : BaseConverter.base62ToBase10(this.encoded);
    }

    isValid() {
        const L = this.number.length;
        if (L < 16 || parseInt(this.number.substr(1, 10), 10) === 0 || parseInt(this.number.substr(10, 6), 10) === 0) return false;
        let s = 0;
        for (let i = 0; i < 16; i++) {
            const k = (i % 2 === 0) ? 2 : 1;
            const d = parseInt(this.number.substr(i, 1), 10) * k;
            s += (d > 9) ? d - 9 : d;
        }
        return ((s % 10) === 0);
    }

    getBank() {
        const bin = this.number.substr(0, 6);
        return banks.find(b => b.BINs.includes(bin)) || null;
    }

    toString() {
        return this.number;
    }
}

module.exports = CardNumber;
