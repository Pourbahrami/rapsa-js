const { Sheba } = require('../index');

describe('Sheba', () => {
  test('Valid Sheba should return true for isValid()', () => {
    const validSheba = new Sheba('IR870570028180010653892101');
    expect(validSheba.isValid()).toBe(true);
  });

  test('Invalid Sheba should return false for isValid()', () => {
    const invalidSheba = new Sheba('IR123456789012345678901234');
    expect(invalidSheba.isValid()).toBe(false);
  });

  test('Encoded and decoded values should match', () => {
    const sheba = new Sheba('IR870570028180010653892101');
    expect(sheba.toString()).toBe('IR870570028180010653892101');
    expect(sheba.encode()).toBe('4Lpy3R90Bm8eV3');
    expect(sheba.decode()).toBe('IR870570028180010653892101');
  });

  test('Check decoding and validation after encoding', () => {
    const encodedSheba = '4Lpy3R90Bm8eV3';
    const sheba = new Sheba(encodedSheba);
    expect(sheba.isValid()).toBe(true);
    expect(sheba.toString()).toBe('IR870570028180010653892101');
  });
});
