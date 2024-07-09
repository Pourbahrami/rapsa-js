const BigNumber = require('bignumber.js');
const BaseConverter = require('./baseConverter');
const banks = require('./banks.json');

class Sheba {
    constructor(input) {
        const upperCase = input.toUpperCase();
        if (!/^IR\d{24}$/.test(upperCase)) {
            this.sheba = this.decode();
            this.encoded = input;
        } else {
            this.sheba = upperCase;
            this.encoded = this.encode();
        }

        if (!this.isValid()) {
            throw new Error('Invalid Sheba number');
        }
    }

    encode() {
        if (this.encoded) return this.encoded;
        const trimmed = this.sheba.substr(2);
        return BaseConverter.base10ToBase62(trimmed);
    }

    decode() {
        if (this.sheba) return this.sheba;
        const decodedBase10 = BaseConverter.base62ToBase10(this.encoded);
        return `IR${decodedBase10}`;
    }

    isValid() {
        if (!/^IR\d{24}$/.test(this.sheba)) return false;
        const transformed = this.sheba.substr(2) + '1827';
        const firstTwoDigits = transformed.substr(0, 2);
        const restDigits = transformed.substr(2);
        const moved = restDigits + firstTwoDigits;
        const number = new BigNumber(moved);
        return number.mod(97).isEqualTo(1);
    }

    getBank() {
        const bankCode = this.sheba.substr(4, 3);
        return banks.find(b => b.code == bankCode) || null;
    }

    toString() {
        return this.sheba;
    }
}

module.exports = Sheba;
