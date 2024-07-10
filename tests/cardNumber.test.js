const { CardNumber } = require('../index');

describe('CardNumber', () => {
    test('Valid CardNumber should return true for isValid()', () => {
        const validCardNumber = new CardNumber('6274129005473742');
        expect(validCardNumber.isValid()).toBe(true);
    });

    test('Invalid CardNumber should throw Error', () => {
        expect(() => {
            new CardNumber('1234567890123456');
        }).toThrow('Invalid card number');
    });

    test('Encoded and decoded values should match', () => {
        const cardNumber = new CardNumber('6274129005473742');
        expect(cardNumber.toString()).toBe('6274129005473742');
        expect(cardNumber.encode()).toBe('SjbYgweOE');
        expect(cardNumber.decode()).toBe('6274129005473742');
    });

    test('Check decoding and validation after encoding', () => {
        const encodedCardNumber = 'SjbYgweOE';
        const cardNumber = new CardNumber(encodedCardNumber);
        expect(cardNumber.isValid()).toBe(true);
        expect(cardNumber.toString()).toBe('6274129005473742');
    });
});