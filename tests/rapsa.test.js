const { Rapsa, CardNumber, Sheba, WalletAddress, BaseConverter } = require('../index');

describe('Rapsa', () => {
    let rapsa;

    beforeEach(() => {
        rapsa = new Rapsa();
    });

    test('should set path to "p" using pay method', () => {
        rapsa.pay();
        expect(rapsa.path).toBe('p');
    });

    test('should set amount and encode it', () => {
        rapsa.pay().addAmount(100);
        const encodedAmount = BaseConverter.base10ToBase62(100);
        expect(rapsa.params.a).toBe(encodedAmount);
    });

    test('should set and get invoice id', () => {
        rapsa.pay().addInvoiceId(12345);
        const encodedInvoiceId = BaseConverter.base10ToBase62(12345);
        expect(rapsa.params.i).toBe(encodedInvoiceId);
        expect(rapsa.getInvoiceId()).toBe('12345');
    });

    test('should add and remove card', () => {
        const cardNumber = '6274129005473742';
        rapsa.pay().addCard(cardNumber);
        const card = new CardNumber(cardNumber);
        expect(rapsa.params.c).toContain(card.encoded);
        rapsa.removeCard(cardNumber);
        expect(rapsa.params.c).not.toContain(card.encoded);
    });

    test('should add and remove sheba', () => {
        const shebaNumber = 'IR870570028180010653892101';
        rapsa.pay().addSheba(shebaNumber);
        const sheba = new Sheba(shebaNumber);
        expect(rapsa.params.s).toContain(sheba.encoded);
        rapsa.removeSheba(shebaNumber);
        expect(rapsa.params.s).not.toContain(sheba.encoded);
    });

    test('should add and remove wallet address', () => {
        const walletAddress = '23456789012348';
        rapsa.pay().addWallet(walletAddress);
        const wallet = new WalletAddress(walletAddress);
        expect(rapsa.params.w).toContain(wallet.encoded);
        rapsa.removeWallet(walletAddress);
        expect(rapsa.params.w).not.toContain(wallet.encoded);
    });

    test('should build correct URL', () => {
        rapsa.pay().addAmount(100).addInvoiceId(12345);
        const encodedAmount = BaseConverter.base10ToBase62(100);
        const encodedInvoiceId = BaseConverter.base10ToBase62(12345);
        const expectedUrl = `rapsa://p?a=${encodedAmount}&i=${encodedInvoiceId}`;
        expect(rapsa.build()).toBe(expectedUrl);
    });

    test('should parse URL correctly', () => {
        const url = 'rapsa://p?a=1c&i=3D7';
        const parsedRapsa = Rapsa.parse(url);
        expect(parsedRapsa.path).toBe('p');
        expect(parsedRapsa.getAmount()).toBe('100');
        expect(parsedRapsa.getInvoiceId()).toBe('12345');
    });

    test('should validate param correctly', () => {
        rapsa.setPath('p');
        expect(() => rapsa.validateParam('x')).toThrowError('Parameter x is not allowed for path p');
    });

    test('should set and get bornaTrxId', () => {
        rapsa.pay().addBornaTrxId(67890);
        const encodedBornaTrxId = BaseConverter.base10ToBase62(67890);
        expect(rapsa.params.b).toBe(encodedBornaTrxId);
        expect(rapsa.getBornaTrxId()).toBe('67890');
    });

    test('should remove bornaTrxId', () => {
        rapsa.pay().addBornaTrxId(67890);
        rapsa.removeBornaTrxId();
        expect(rapsa.params.b).toBeUndefined();
    });
});
