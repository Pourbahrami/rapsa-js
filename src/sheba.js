const BigNumber = require('bignumber.js');
const BaseConverter = require('./baseConverter');
const banks = require('./banks.json');

/**
 * Class representing a Sheba number.
 */
class Sheba {
    /**
     * Constructs a Sheba number instance.
     * @param {string} input - The Sheba number or encoded string.
     */
    constructor(input) {
        const upperCase = input.toUpperCase();
        if (!/^IR\d{24}$/.test(upperCase)) {
            this.encoded = input;
            this.number = this.decode();
        } else {
            this.number = upperCase;
            this.encoded = this.encode();
        }

        if (!this.isValid()) {
            throw new Error('Invalid Sheba number');
        }
    }

    /**
     * Encodes the Sheba number to a base 62 string.
     * @returns {string} The encoded Sheba number.
     */
    encode() {
        if (this.encoded) return this.encoded;
        const trimmed = this.number.slice(2);
        return BaseConverter.base10ToBase62(trimmed);
    }

    /**
     * Decodes the encoded Sheba number to its original form.
     * @returns {string} The decoded Sheba number.
     */
    decode() {
        if (this.number) return this.number;
        const decodedBase10 = BaseConverter.base62ToBase10(this.encoded);
        const paddedNumber = decodedBase10.padStart(24, '0');
        return `IR${paddedNumber}`;
    }

    /**
     * Validates the Sheba number.
     * @returns {boolean} True if the Sheba number is valid, false otherwise.
     */
    isValid() {
        if (!/^IR\d{24}$/.test(this.number)) return false;
        const transformed = this.number.slice(2) + '1827';
        const firstTwoDigits = transformed.slice(0, 2);
        const restDigits = transformed.slice(2);
        const moved = restDigits + firstTwoDigits;
        const number = new BigNumber(moved);
        return number.mod(97).isEqualTo(1);
    }

    /**
     * Retrieves the bank information based on the Sheba number.
     * @returns {Object} The bank information or a default object if not found.
     */
    getBank() {
        const bankCode = Number(this.number.slice(4, 7));
        return banks.find(b => b.code == bankCode) || { code: 0, name: 'unknown' };
    }

    /**
     * Returns the Sheba number as a string.
     * @returns {string} The Sheba number.
     */
    toString() {
        return this.number;
    }
}

module.exports = Sheba;
