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

    /**
     * Encodes the Sheba number to a base 62 string.
     * @returns {string} The encoded Sheba number.
     */
    encode() {
        if (this.encoded) return this.encoded;
        const trimmed = this.sheba.substr(2);
        return BaseConverter.base10ToBase62(trimmed);
    }

    /**
     * Decodes the encoded Sheba number to its original form.
     * @returns {string} The decoded Sheba number.
     */
    decode() {
        if (this.sheba) return this.sheba;
        const decodedBase10 = BaseConverter.base62ToBase10(this.encoded);
        return `IR${decodedBase10}`;
    }

    /**
     * Validates the Sheba number.
     * @returns {boolean} True if the Sheba number is valid, false otherwise.
     */
    isValid() {
        if (!/^IR\d{24}$/.test(this.sheba)) return false;
        const transformed = this.sheba.substr(2) + '1827';
        const firstTwoDigits = transformed.substr(0, 2);
        const restDigits = transformed.substr(2);
        const moved = restDigits + firstTwoDigits;
        const number = new BigNumber(moved);
        return number.mod(97).isEqualTo(1);
    }

    /**
     * Retrieves the bank information based on the Sheba number.
     * @returns {Object|null} The bank information or null if not found.
     */
    getBank() {
        const bankCode = this.sheba.substr(4, 3);
        return banks.find(b => b.code == bankCode) || null;
    }

    /**
     * Returns the Sheba number as a string.
     * @returns {string} The Sheba number.
     */
    toString() {
        return this.sheba;
    }
}

module.exports = Sheba;
