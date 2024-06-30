// baseConverter.js

const BigNumber = require('bignumber.js');

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

class BaseConverter {
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

module.exports = BaseConverter
