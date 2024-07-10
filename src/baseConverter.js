const BigNumber = require('bignumber.js');

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Class for base conversion operations.
 */
class BaseConverter {
    /**
     * Converts a base 10 number to a base 62 string.
     * @param {string|number} number - The base 10 number to convert.
     * @returns {string} The base 62 representation of the number.
     */
    static base10ToBase62(number) {
        let result = '';
        const base = new BigNumber('62');
        const zero = new BigNumber('0');

        let num = new BigNumber(number);

        while (num.isGreaterThan(zero)) {
            const remainder = num.mod(base).toNumber(); // Convert remainder to number
            result = BASE62_CHARS[remainder] + result;
            num = num.dividedToIntegerBy(base);
        }

        return result || '0'; // Return '0' if number is zero
    }

    /**
     * Converts a base 62 string to a base 10 number.
     * @param {string} number - The base 62 string to convert.
     * @returns {string} The base 10 representation of the number.
     */
    static base62ToBase10(number) {
        let result = new BigNumber('0');
        const base = new BigNumber('62');
        const digits = number.split('').reverse(); // Reverse to process from least significant to most significant

        for (let i = 0; i < digits.length; i++) {
            const char = digits[i];
            const value = BASE62_CHARS.indexOf(char);
            result = result.plus(new BigNumber(value).multipliedBy(base.pow(i)));
        }

        return result.toFixed();
    }
}

module.exports = BaseConverter;
