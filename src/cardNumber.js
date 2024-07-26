const BaseConverter = require('./baseConverter');
const banks = require('./banks.json');

/**
 * Class representing a Card Number.
 */
class CardNumber {
    /**
     * Create a CardNumber instance.
     * @param {string} input - The card number or encoded card number.
     * @throws {Error} If the card number is invalid.
     */
    constructor(input) {
        if (/^[0-9]{16,}$/.test(input)) {
            this.number = input;
            this.encoded = this.encode();
        } else {
            this.encoded = input;
            this.number = this.decode();
        }

        if (!this.isValid()) {
            throw new Error('Invalid card number');
        }
    }

    /**
     * Encodes the card number to base62.
     * @returns {string} The encoded card number.
     */
    encode() {
        return this.encoded ? this.encoded : BaseConverter.base10ToBase62(this.number);
    }

    /**
     * Decodes the encoded card number to base10.
     * @returns {string} The decoded card number.
     */
    decode() {
        return this.number ? this.number : BaseConverter.base62ToBase10(this.encoded);
    }

    /**
     * Validates the card number using the Luhn algorithm.
     * @returns {boolean} True if the card number is valid, false otherwise.
     */
    isValid() {
        const L = this.number.length;
        if (L !== 16 || parseInt(this.number.substr(1, 10), 10) === 0 || parseInt(this.number.substr(10, 6), 10) === 0) return false;
        let s = 0;
        for (let i = 0; i < 16; i++) {
            const k = (i % 2 === 0) ? 2 : 1;
            const d = parseInt(this.number.substr(i, 1), 10) * k;
            s += (d > 9) ? d - 9 : d;
        }
        return ((s % 10) === 0);
    }

    /**
     * Retrieves the bank associated with the card number.
     * @returns {Object} The bank information or a default object if not found.
     */
    getBank() {
        const bin = this.number.slice(0, 6);
        return banks.find(b => b.BINs.includes(Number(bin))) || { code: 0, name: 'unknown' };
    }

    /**
     * Returns the card number as a string.
     * @returns {string} The card number.
     */
    toString() {
        return this.number;
    }
}

module.exports = CardNumber;
