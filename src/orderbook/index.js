const {WebsocketClient} = require('gdax');
const {
  GDAX_SANDBOX_WEBSOCKET_URL,
  GDAX_PRODUCTION_WEBSOCKET_URL
} = require('../constants');
const {sortPrices, buildListFromSnapshot, insertIntoPriceList} = require('../utils');
const { EventEmitter } = require('events');

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Orderbook extends EventEmitter {
  constructor({product='ETH-USD', sandbox=true, interval=1000}) {
    super();
    this.product = product;
    this.sandbox = sandbox;
    this.interval = interval;
    this.bids = {};
    this.asks = {};
  }

  start() {
    this.websocket = new WebsocketClient(
      [this.product],
      this.sandbox ? GDAX_SANDBOX_WEBSOCKET_URL : GDAX_PRODUCTION_WEBSOCKET_URL,
      null,
      { channels: ['level2'] }
    );
    this._start();
  }

  stop() {
    this._stop();
  }

  log(interval) {
    setInterval(() => {
      console.log('Bids:', this.bids.value, 'Asks:', this.asks.value);
    }, interval);
  }

  _start() {
    this.websocket.on('message', this._handleUpdate.bind(this));
  }

  _stop() {
    this.websocket.socket.close();
    this.websocket = null;
  }

  _handleUpdate(message) {
    if (message.type === 'snapshot') {
      this.bids = buildListFromSnapshot(
        sortPrices(message.bids, true),
        'bid',
        Node
      );
      this.asks = buildListFromSnapshot(
        sortPrices(message.asks, false),
        'ask',
        Node
      );
    } else if (message.type === 'l2update') {
      const {changes} = message;
      changes.forEach(change => {
        if (change[0] === 'buy') {
          this.bids = insertIntoPriceList(this.bids, change, Node);
        } else {
          this.asks = insertIntoPriceList(this.asks, change, Node);
        }
        this.emit('change', this)
      });
    }
  }
}

module.exports = Orderbook;