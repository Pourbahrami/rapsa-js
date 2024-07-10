const { WalletAddress } = require('../index');

describe('WalletAddress', () => {
  test('Valid WalletAddress should return true for isValid()', () => {
    const validWalletAddress = new WalletAddress('12345678901237');
    expect(validWalletAddress.isValid()).toBe(true);
  });

  test('Invalid WalletAddress should throw Error', () => {
    expect(() => {
      new WalletAddress('12345678901234');
    }).toThrow('Invalid wallet address');
  });

  test('Encoded and decoded values should match', () => {
    const walletAddress = new WalletAddress('12345678901237');
    expect(walletAddress.toString()).toBe('12345678901237');
    expect(walletAddress.encode()).toBe('3VLrOWLl');
    expect(walletAddress.decode()).toBe('12345678901237');
  });

  test('Check decoding and validation after encoding', () => {
    const encodedWalletAddress = '3VLrOWLl';
    const walletAddress = new WalletAddress(encodedWalletAddress);
    expect(walletAddress.isValid()).toBe(true);
    expect(walletAddress.toString()).toBe('12345678901237');
  });
});
