const BaseConverter = require('./baseConverter');
const banks = require('./banks.json');

class CardNumber {
    constructor(number) {
        if (/^[0-9]+$/.test(number)) {
            this.decoded = number;
            this.encoded = this.encode();
        } else {
            this.encoded = number;
            this.decoded = this.decode();
        }
    }

    encode() {
        return BaseConverter.base10ToBase62(this.decoded);
    }

    decode() {
        return BaseConverter.base62ToBase10(this.encoded);
    }

    isValid() {
        const L = this.decoded.length;
        if (L < 16 || parseInt(this.decoded.substr(1, 10), 10) === 0 || parseInt(this.decoded.substr(10, 6), 10) === 0) return false;
        let s = 0;
        for (let i = 0; i < 16; i++) {
            const k = (i % 2 === 0) ? 2 : 1;
            const d = parseInt(this.decoded.substr(i, 1), 10) * k;
            s += (d > 9) ? d - 9 : d;
        }
        return ((s % 10) === 0);
    }

    getBank() {
        const bankCode = this.decoded.substr(0, 6);
        return banks.find(b => b.cardCode == bankCode) || null;
    }

    toString() {
        return this.decoded;
    }
}

module.exports = CardNumber;
