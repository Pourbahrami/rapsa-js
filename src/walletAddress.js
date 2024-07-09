const BaseConverter = require('./baseConverter');
const banks = require('./banks.json');

class WalletAddress {
    constructor(number) {
        if (/^\d{14}$/.test(number)) {
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
        const num = this.decoded;
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

    getBank() {
        const bankCode = this.decoded.substr(1, 2);
        return banks.find(b => b.code == bankCode) || null;
    }

    toString() {
        return this.decoded;
    }
}

module.exports = WalletAddress;
