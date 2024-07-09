const BaseConverter = require('./baseConverter');
const banks = require('./banks.json');

class WalletAddress {
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

    encode() {
        return this.encoded ? this.encoded : BaseConverter.base10ToBase62(this.address);
    }

    decode() {
        return this.address ? this.address : BaseConverter.base62ToBase10(this.encoded);
    }

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

    getBank() {
        const bankCode = this.address.substr(1, 2);
        return banks.find(b => b.code == bankCode) || null;
    }

    toString() {
        return this.address;
    }
}

module.exports = WalletAddress;
