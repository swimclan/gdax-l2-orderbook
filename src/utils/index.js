module.exports.sortPrices = (prices, reverse=false) => {
  return prices.sort((a, b) => {
    if (+a[0] < +b[0])
      return !reverse ? -1 : 1;
    if (+a[0] > +b[0])
      return !reverse ? 1 : -1;
    return 0;
  });
}

module.exports.createListFromSorted = (arr, Node) => {
  let node, current;
  for (const i in arr) {
    if (!node) {
      node = new Node(arr[i]);
      current = node;
      continue;
    }
    current.next = new Node(arr[i]);
    current = current.next;
  }
  return node;
}

module.exports.buildListFromSnapshot = (prices, side, Node) => {
  return this.createListFromSorted(
    this.sortPrices(prices, side.match(/ask/) == null),
    Node
  );
}

module.exports.insertIntoPriceList = (prices, change, Node) => {
  let ret = prices;
  const [ side, price, size ] = change;
  if (+ret.value[0] === +price && +size === 0) {
    return ret.next;
  } else if (+ret.value[0] === +price) {
    ret.value = [price, size];
    return ret;
  } else if (((side === 'sell' && +price < +ret.value[0]) || (side === 'buy' && +price > +ret.value[0])) && +size !== 0) {
    const node = new Node([price, size]);
    const temp = ret;
    ret = node;
    ret.next = temp;
    return ret;
  }
  let current = ret;
  while(current.next) {
    if (+current.next.value[0] === +price && +size === 0) {
      current.next = current.next.next;
      break;
    } else if (+current.next.value[0] === +price) {
      current.next.value = [price, size];
      break;
    } else if (side === 'sell' && +price > +current.next.value[0]) {
      current = current.next;
    } else if (side === 'buy' && +price < +current.next.value[0]) {
      current = current.next;
    } else if (+size !== 0) {
      const node = new Node([price, size]);
      const temp = current.next;
      current.next = node;
      current.next.next = temp;
      break;
    } else {
      break;
    }
  }
  return ret;
}