const BigNumber = require('bignumber.js');
const BaseConverter = require('./baseConverter');

class Sheba {
    constructor(number) {
        if (!/^IR\d{24}$/.test(number)) {
            this.encoded = number;
            this.decoded = this.decode();
        } else {
            this.decoded = number;
            this.encoded = this.encode();
        }
    }

    encode() {
        const trimmed = this.decoded.substr(2);
        return BaseConverter.base10ToBase62(trimmed);
    }

    decode() {
        const decodedBase10 = BaseConverter.base62ToBase10(this.encoded);
        return `IR${decodedBase10}`;
    }

    isValid() {
        const transformed = this.decoded.substr(2) + '1827';
        const firstTwoDigits = transformed.substr(0, 2);
        const restDigits = transformed.substr(2);
        const moved = restDigits + firstTwoDigits;
        const number = new BigNumber(moved);
        return number.mod(97).isEqualTo(1);
    }

    toString() {
        return this.decoded;
    }
}

module.exports = Sheba;
