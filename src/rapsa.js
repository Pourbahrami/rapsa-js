const BaseConverter = require('./baseConverter');
const WalletAddress = require('./walletAddress');
const CardNumber = require('./cardNumber');
const Sheba = require('./sheba');

const validParams = {
  'p': ['a', 'b', 'i', 'c', 's', 'w', 'u'],
  't': ['a', 'c', 's', 'w'],
  'b': ['b', 'p'],
  'd': []
};

/**
 * Class representing the Rapsa URI builder.
 */
class Rapsa {
  constructor() {
    this.scheme = 'rapsa://';
    this.path = '';
    this.params = {};
  }

  /**
   * Sets the path for the Rapsa URI.
   * @param {string} path - The path to set.
   * @returns {Rapsa} The current Rapsa instance.
   * @throws {Error} If the path is invalid.
   */
  setPath(path) {
    if (!validParams[path]) {
      throw new Error('Invalid path');
    }
    this.path = path;
    this.params = {};
    return this;
  }

  /**
   * Sets the path to 'p' for payment.
   * @returns {Rapsa} The current Rapsa instance.
   */
  pay() {
    this.setPath('p');
    return this;
  }

  /**
   * Sets the path to 't' for transfer.
   * @returns {Rapsa} The current Rapsa instance.
   */
  transfer() {
    this.setPath('t');
    return this;
  }

  /**
   * Sets the path to 'b' for bill.
   * @returns {Rapsa} The current Rapsa instance.
   */
  bill() {
    this.setPath('b');
    return this;
  }

  /**
   * Sets the path to 'd' for donation.
   * @returns {Rapsa} The current Rapsa instance.
   */
  donate() {
    this.setPath('d');
    return this;
  }

  /**
   * Validates if the parameter is allowed for the current path.
   * @param {string} param - The parameter to validate.
   * @throws {Error} If the path is not set or the parameter is not allowed.
   */
  validateParam(param) {
    if (!this.path) {
      throw new Error(`Raspa path not set`);
    }
    if (!validParams[this.path].includes(param)) {
      throw new Error(`Parameter ${param} is not allowed for path ${this.path}`);
    }
  }

  /**
   * Adds the amount parameter.
   * @param {number} amount - The amount to add.
   * @returns {Rapsa} The current Rapsa instance.
   */
  addAmount(amount) {
    this.validateParam('a');
    const encodedAmount = BaseConverter.base10ToBase62(amount);
    this.params.a = encodedAmount;
    return this;
  }

  /**
   * Removes the amount.
   * @returns {Rapsa} The Rapsa instance.
   */
  removeAmount() {
    this.validateParam('a');
    delete this.params.a;
    return this;
  }

  /**
   * Adds the Borna transaction ID.
   * @param {string} bornaTrxId - The Borna transaction ID to add.
   * @returns {Rapsa} The Rapsa instance.
   */
  addBornaTrxId(bornaTrxId) {
    this.validateParam('b');
    const encodedBornaTrxId = BaseConverter.base10ToBase62(bornaTrxId);
    this.params.b = encodedBornaTrxId;
    return this;
  }

  /**
  * Removes the Borna transaction ID.
  * @returns {Rapsa} The Rapsa instance.
  */
  removeBornaTrxId() {
    this.validateParam('b');
    delete this.params.b;
    return this;
  }

  /**
   * Adds the invoice ID parameter.
   * @param {number} invoiceId - The invoice ID to add.
   * @returns {Rapsa} The current Rapsa instance.
   */
  addInvoiceId(invoiceId) {
    this.validateParam('i');
    const encodedInvoiceId = BaseConverter.base10ToBase62(invoiceId);
    this.params.i = encodedInvoiceId;
    return this;
  }

  /**
   * Removes the invoice ID.
   * @returns {Rapsa} The Rapsa instance.
   */
  removeInvoiceId() {
    this.validateParam('i');
    delete this.params.i;
    return this;
  }

  /**
   * Adds the card number parameter.
   * @param {string} number - The card number to add.
   * @returns {Rapsa} The current Rapsa instance.
   */
  addCard(number) {
    this.validateParam('c');
    const card = new CardNumber(number);

    if (!this.params.c) {
      this.params.c = [];
    }
    this.params.c.push(card.encoded);

    return this;
  }

  /**
   * Removes a specific card number.
   * @param {string} number - The card number to remove.
   * @returns {Rapsa} The Rapsa instance.
   */
  removeCard(number) {
    this.validateParam('c');
    if (this.params.c) {
      const card = new CardNumber(number);
      this.params.c = this.params.c.filter(c => c !== card.encoded);
    }
    return this;
  }

  /**
  * Removes all card numbers.
  * @returns {Rapsa} The Rapsa instance.
  */
  removeCards() {
    this.validateParam('c');
    this.params.c = [];
    return this;
  }

  /**
   * Adds the Sheba number parameter.
   * @param {string} number - The Sheba number to add.
   * @returns {Rapsa} The current Rapsa instance.
   */
  addSheba(number) {
    this.validateParam('s');
    const sheba = new Sheba(number);

    if (!this.params.s) {
      this.params.s = [];
    }
    this.params.s.push(sheba.encoded);

    return this;
  }

  /**
  * Removes a specific Sheba number.
  * @param {string} number - The Sheba number to remove.
  * @returns {Rapsa} The Rapsa instance.
  */
  removeSheba(number) {
    this.validateParam('s');
    if (this.params.s) {
      const sheba = new Sheba(number);
      this.params.s = this.params.s.filter(s => s !== sheba.encoded);
    }
    return this;
  }

  /**
  * Removes all Sheba numbers.
  * @returns {Rapsa} The Rapsa instance.
  */
  removeShebas() {
    this.validateParam('s');
    this.params.s = [];
    return this;
  }

  /**
   * Adds the wallet address parameter.
   * @param {string} address - The wallet address to add.
   * @returns {Rapsa} The current Rapsa instance.
   * @throws {Error} If the wallet address is not valid for the current path.
   */
  addWallet(address) {
    this.validateParam('w');
    if (this.path == 't' && address[0] != '1') {
      throw new Error('Only non-commercial wallet addresses are allowed in `transfer` path');
    }
    if (this.path == 'p' && address[0] != '2') {
      throw new Error('Only commercial wallet addresses are allowed in `pay` path');
    }
    const wallet = new WalletAddress(address);

    if (!this.params.w) {
      this.params.w = [];
    }
    this.params.w.push(wallet.encoded);

    return this;
  }

  /**
  * Removes a specific wallet address.
  * @param {string} address - The wallet address to remove.
  * @returns {Rapsa} The Rapsa instance.
  */
  removeWallet(address) {
    this.validateParam('w');
    if (this.params.w) {
      const wallet = new WalletAddress(address);
      this.params.w = this.params.w.filter(w => w !== wallet.encoded);
    }
    return this;
  }

  /**
  * Removes all wallet addresses.
  * @returns {Rapsa} The Rapsa instance.
  */
  removeWallets() {
    this.validateParam('w');
    this.params.w = [];
    return this;
  }

  /**
   * Adds the unit parameter.
   * @param {number} unit - The unit to add (must be between 1 and 5).
   * @returns {Rapsa} The current Rapsa instance.
   * @throws {Error} If the unit is not between 1 and 5.
   */
  addUnit(unit) {
    this.validateParam('u');
    if (unit < 1 || unit > 5) {
      throw new Error('Unit must be a number between 1 and 5');
    }
    this.params.u = unit;
    return this;
  }

  /**
   * Removes the unit.
   * @returns {Rapsa} The Rapsa instance.
   */
  removeUnit() {
    this.validateParam('u');
    delete this.params.u;
    return this;
  }

  /**
   * Adds the bill ID parameter.
   * @param {number} billId - The bill ID to add.
   * @returns {Rapsa} The current Rapsa instance.
   */
  addBillId(billId) {
    this.validateParam('b');
    const encodedBillId = BaseConverter.base10ToBase62(billId);
    this.params.b = encodedBillId;
    return this;
  }

  /**
   * Removes the bill ID.
   * @returns {Rapsa} The Rapsa instance.
   */
  removeBillId() {
    this.validateParam('b');
    delete this.params.b;
    return this;
  }

  /**
   * Adds the payment ID parameter.
   * @param {number} paymentId - The payment ID to add.
   * @returns {Rapsa} The current Rapsa instance.
   */
  addPaymentId(paymentId) {
    this.validateParam('p');
    const encodedPaymentId = BaseConverter.base10ToBase62(paymentId);
    this.params.p = encodedPaymentId;
    return this;
  }

  /**
   * Removes the payment ID.
   * @returns {Rapsa} The Rapsa instance.
   */
  removePaymentId() {
    this.validateParam('p');
    delete this.params.p;
    return this;
  }

  /**
   * Builds the Rapsa URI.
   * @returns {string} The Rapsa URI.
   * @throws {Error} If the path is not set.
   */
  build() {
    if (!this.path) throw new Error('Rapsa path not set');
    const queryString = Object.entries(this.params)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(v => `${key}=${encodeURIComponent(v)}`).join('&');
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');
    return queryString ? `${this.scheme}${this.path}?${queryString}` : `${this.scheme}${this.path}`;
  }

  /**
   * Parses a Rapsa URI into a Rapsa instance.
   * @param {string} uri - The URI to parse.
   * @returns {Rapsa} The Rapsa instance.
   */
  static parse(uri) {
    const [schemeAndPath, queryString] = uri.split('?');
    const path = schemeAndPath.split('://')[1];

    const params = {};
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (!params[key]) {
          params[key] = [];
        }
        params[key].push(decodeURIComponent(value));
      });
    }

    const rapsa = new Rapsa().setPath(path);

    for (const key in params) {
      if (params[key].length === 1) {
        params[key] = params[key][0];
      }
    }

    return rapsa.setParams(params);
  }

  /**
   * Sets the parameters for the Rapsa instance.
   * @param {Object} params - The parameters to set.
   * @returns {Rapsa} The current Rapsa instance.
   */
  setParams(params) {
    this.params = params;
    return this;
  }

  /**
   * Retrieves the amount parameter.
   * @returns {number|null} The amount or null if not set.
   */
  getAmount() {
    return this.params.a ? BaseConverter.base62ToBase10(this.params.a) : null;
  }

  /**
   * Retrieves the Borna transaction ID.
   * @returns {string|null} The Borna transaction ID or null if not set.
   */
  getBornaTrxId() {
    return this.params.b ? BaseConverter.base62ToBase10(this.params.b) : null;
  }

  /**
   * Retrieves the invoice ID parameter.
   * @returns {number|null} The invoice ID or null if not set.
   */
  getInvoiceId() {
    return this.params.i ? BaseConverter.base62ToBase10(this.params.i) : null;
  }

  /**
   * Retrieves the card numbers parameter.
   * @returns {CardNumber[]|null} The card numbers or null if not set.
   */
  getCards() {
    return this.params.c ? this.params.c.map(encoded => new CardNumber(encoded)) : null;
  }

  /**
   * Retrieves the Sheba numbers parameter.
   * @returns {Sheba[]|null} The Sheba numbers or null if not set.
   */
  getShebas() {
    return this.params.s ? this.params.s.map(encoded => new Sheba(encoded)) : null;
  }

  /**
   * Retrieves the wallet addresses parameter.
   * @returns {WalletAddress[]|null} The wallet addresses or null if not set.
   */
  getWallets() {
    return this.params.w ? this.params.w.map(encoded => new WalletAddress(encoded)) : null;
  }

  /**
   * Retrieves the unit parameter.
   * @returns {number|null} The unit or null if not set.
   */
  getUnit() {
    return this.params.u ? parseInt(this.params.u, 10) : null;
  }

  /**
   * Retrieves the bill ID parameter.
   * @returns {number|null} The bill ID or null if not set.
   */
  getBillId() {
    return this.params.b ? BaseConverter.base62ToBase10(this.params.b) : null;
  }

  /**
   * Retrieves the payment ID parameter.
   * @returns {number|null} The payment ID or null if not set.
   */
  getPaymentId() {
    return this.params.p ? BaseConverter.base62ToBase10(this.params.p) : null;
  }
}

module.exports = Rapsa;
