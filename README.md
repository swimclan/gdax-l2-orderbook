# GDAX L2 Orderbook

## Synopsis

GDAX L2 Orderbook is a module to generate a basic Level2 orderbook for any product traded on the Coinbase Pro cryptocurrency exchange.  Users can install the package, instantiate the Orderbook and start it up.  It is event driven so a `change` event will fire whenever a change is made on with the bid side or the ask side.  There is also a simple logger to see the best bid and best ask at any time interval needed (in ms).

## Code Example

Installation and instantiation is very easy to get started.  Here is a basic usage example:

```js
const Orderbook = require('gdax-l2-orderbook');

const product = 'ETH-USD';
const sandbox = false // Connect to the production exchange.  Defaults to true
const orderbook = new Orderbook({product, sandbox});
orderbook.start();

orderbook.on('change', book => {
  console.log(book.bids.value, book.asks.value);
  // Since the bids and asks are linked lists, the "value" property
  // at the top of the linked list will be the best bid / ask.  If 
  // you want to seek further into the orderbook you will need
  // to traverse the linked list by following the "next" property
  // i.e. book.bids.next.next.next.next.next.value (etc).  Use 
  // your favorite recursive traversal method.

  // The "value" property will return a [price, size] tuple as
  // seen in the below example console.log:

/*
[ '147.27000000', '3.57' ] [ '147.28000000', '4.03' ]
[ '147.27000000', '3.57' ] [ '147.28000000', '4.03' ]
[ '147.27000000', '3.57' ] [ '147.28000000', '4.03' ]
[ '147.27000000', '3.57' ] [ '147.28000000', '4.03' ]
[ '147.27000000', '3.57' ] [ '147.28000000', '2.69908921' ]
[ '147.27000000', '3.57' ] [ '147.28000000', '2.69908921' ]
[ '147.27000000', '3.57' ] [ '147.28000000', '2.69908921' ]
*/

orderbook.log(1000); // Module will console.log out best ask and
                     // best bid every 1sec (1000ms)
```

## Motivation

As a hobbyist cryptocurrency trader I needed a reliable but simple module
that could enable me to keep track of my limit orders relative to the
orderbook.  I did not see a need to mirror the Level 3 book so this 
implementation seemed to do nicely.  I believe that this module can help
other hobbyist/professional crypto traders who are using Coinbase Pro with 
automation-based trading tools 

## Installation

Installation into a Node project is as simple as:

```shell
npm i gdax-l2-orderbook --save
```

Recommend Node.js v.10 and above.

## API Reference

See code example above.

## Tests

You can run unit test using `npm test` command. It will run a Jest test suite.

## Contributors

Contributors are welcome to send pull requests on the project.  Please write a short synopsis of any enhancements or defect fixing is being proposed in the PR.

## License

This software is made public by way of the ISC (Internet Software Consortium).  No warranties are given and software is made available "as-is."