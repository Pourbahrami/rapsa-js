const BaseConverter = require('./baseConverter');
const WalletAddress = require('./walletAddress');
const CardNumber = require('./cardNumber');
const Sheba = require('./sheba');

const validParams = {
  'p': ['a', 'i', 'c', 's', 'w', 'u'],
  't': ['a', 'c', 's', 'w'],
  'b': ['b', 'p'],
  'd': []
};
class Rapsa {
  constructor() {
    this.scheme = 'rapsa://';
    this.path = '';
    this.params = {};
  }

  setPath(path) {
    if (!validParams[path]) {
      throw new Error('Invalid path');
    }
    this.path = path;
    this.params = {};
    return this;
  }

  pay() {
    this.setPath('p');
    return this;
  }

  transfer() {
    this.setPath('t');
    return this;
  }

  bill() {
    this.setPath('b');
    return this;
  }

  donate() {
    this.setPath('d');
    return this;
  }

  validateParam(param) {
    if (!this.path) {
      throw new Error(`Raspa path not set`);
    }
    if (!validParams[this.path].includes(param)) {
      throw new Error(`Parameter ${param} is not allowed for path ${this.path}`);
    }
  }

  addAmount(amount) {
    this.validateParam('a');
    const encodedAmount = BaseConverter.base10ToBase62(amount);
    this.params.a = encodedAmount;
    return this;
  }

  addInvoiceId(invoiceId) {
    this.validateParam('i');
    const encodedInvoiceId = BaseConverter.base10ToBase62(invoiceId);
    this.params.i = encodedInvoiceId;
    return this;
  }

  addCard(number) {
    this.validateParam('c');
    const card = new CardNumber(number);

    if (!this.params.c) {
      this.params.c = [];
    }
    this.params.c.push(card.encoded);

    return this;
  }

  addSheba(number) {
    this.validateParam('s');
    const sheba = new Sheba(number);
    
    if (!this.params.s) {
      this.params.s = [];
    }
    this.params.s.push(sheba.encoded);

    return this;
  }

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

  addUnit(unit) {
    this.validateParam('u');
    if (unit < 1 || unit > 5) {
      throw new Error('Unit must be a number between 1 and 5');
    }
    this.params.u = unit;
    return this;
  }

  addBillId(billId) {
    this.validateParam('b');
    const encodedBillId = BaseConverter.base10ToBase62(billId);
    this.params.b = encodedBillId;
    return this;
  }

  addPaymentId(paymentId) {
    this.validateParam('p');
    const encodedPaymentId = BaseConverter.base10ToBase62(paymentId);
    this.params.p = encodedPaymentId;
    return this;
  }

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

  setParams(params) {
    this.params = params;
    return this;
  }

  getAmount() {
    return this.params.a ? BaseConverter.base62ToBase10(this.params.a) : null;
  }

  getInvoiceId() {
    return this.params.i ? BaseConverter.base62ToBase10(this.params.i) : null;
  }

  getCards() {
    return this.params.c ? this.params.c.map(encoded => new CardNumber(encoded)) : null;
  }

  getShebas() {
    return this.params.s ? this.params.s.map(encoded => new Sheba(encoded)) : null;
  }

  getWallets() {
    return this.params.w ? this.params.w.map(encoded => new WalletAddress(encoded)) : null;
  }

  getUnit() {
    return this.params.u ? parseInt(this.params.u, 10) : null;
  }

  getBillId() {
    return this.params.b ? BaseConverter.base62ToBase10(this.params.b) : null;
  }

  getPaymentId() {
    return this.params.p ? BaseConverter.base62ToBase10(this.params.p) : null;
  }
}

module.exports = Rapsa;