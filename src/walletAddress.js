const BaseConverter = require('./baseConverter');
const banks = require('./banks.json');

/**
 * Class representing a wallet address.
 */
class WalletAddress {
    /**
     * Constructs a wallet address instance.
     * @param {string} input - The wallet address or encoded string.
     */
    constructor(input) {
        if (/^\d{14}$/.test(input)) {
            this.address = input;
            this.encoded = this.encode();
        } else {
            this.encoded = input;
            this.address = this.decode();
        }

        if (!this.isValid()) {
            throw new Error('Invalid wallet address');
        }
    }

    /**
     * Encodes the wallet address to a base 62 string.
     * @returns {string} The encoded wallet address.
     */
    encode() {
        return this.encoded ? this.encoded : BaseConverter.base10ToBase62(this.address);
    }

    /**
     * Decodes the encoded wallet address to its original form.
     * @returns {string} The decoded wallet address.
     */
    decode() {
        return this.address ? this.address : BaseConverter.base62ToBase10(this.encoded);
    }

    /**
     * Validates the wallet address.
     * @returns {boolean} True if the wallet address is valid, false otherwise.
     */
    isValid() {
        if (!/^[1-4]\d{13}$/.test(this.address)) return false;
        const num = this.address;
        const checksumDigit = parseInt(num.charAt(num.length - 1), 10);
        const digits = num.substr(0, num.length - 1);

        let sum = 0;
        let shouldDouble = true;
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        const checksum = (10 - (sum % 10)) % 10;

        return checksum === checksumDigit;
    }

    /**
     * Retrieves the bank information based on the wallet address.
     * @returns {Object} The bank information or a default object if not found.
     */
    getBank() {
        const bankCode = this.address.slice(1, 2);
        return banks.find(b => b.code == Number(bankCode)) || { code: 0, name: 'unknown' };
    }

    /**
     * Returns the wallet address as a string.
     * @returns {string} The wallet address.
     */
    toString() {
        return this.address;
    }
}

module.exports = WalletAddress;
