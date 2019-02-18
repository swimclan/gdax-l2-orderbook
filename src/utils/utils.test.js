import {insertIntoPriceList} from '.';
import {Node} from '../models';

describe('utils testing', () => {
  describe('insertIntoPriceList()', () => {

    let book = {};
    beforeEach(() => {
      book.asks = new Node(['100', '1']);
      book.asks.next = new Node(['101', '1']);
      book.asks.next.next = new Node(['103', '1']);

      book.bids = new Node(['100', '1']);
      book.bids.next = new Node(['99', '1']);
      book.bids.next.next = new Node(['95', '1']); 
    });

    afterEach(() => {
      book = {};
    });
    
    test('It will remove the first element from the book if the incoming change matches price and size is zero', () => {
      const newAsks = insertIntoPriceList(book.asks, ['sell', '100', '0'], Node);
      const newBids = insertIntoPriceList(book.bids, ['buy', '100', '0'], Node);
      expect(newAsks.value).toEqual(['101', '1']);
      expect(newAsks.next.value).toEqual(['103', '1']);
      expect(newBids.value).toEqual(['99', '1']);
      expect(newBids.next.value).toEqual(['95', '1']);
    });

    test('It will change the first element if the price matches from the incoming change', () => {
      const newAsks = insertIntoPriceList(book.asks, ['sell', '100', '3'], Node);
      const newBids = insertIntoPriceList(book.bids, ['buy', '100', '3'], Node);
      expect(newAsks.value).toEqual(['100', '3']);
      expect(newBids.value).toEqual(['100', '3']);
    });

    test('It will insert an element before an element that has lower price if side is buy', () => {
      const newBids = insertIntoPriceList(book.bids, ['buy', '96', '1'], Node);
      expect(newBids.next.next.value).toEqual(['96', '1']);
    });

    test('It will insert an element before an element that has higher price if side is sell', () => {
      const newAsks = insertIntoPriceList(book.asks, ['sell', '102', '1'], Node);
      expect(newAsks.next.next.value).toEqual(['102', '1']);
    });

    test('It will insert a new element at the front of the list if side is sell and price is lower', () => {
      const newAsks = insertIntoPriceList(book.asks, ['sell', '99', '1'], Node);
      expect(newAsks.value).toEqual(['99', '1']);
    });

    test('It will insert a new element at the front of the list if side is buy and price is higher', () => {
      const newAsks = insertIntoPriceList(book.asks, ['buy', '101', '1'], Node);
      expect(newAsks.value).toEqual(['101', '1']);
    });

    test('It wont insert an element if the change size is zero even if there is no price match', () => {
      const newAsks = insertIntoPriceList(book.asks, ['sell', '102', '0'], Node);
      const newBids = insertIntoPriceList(book.bids, ['buy', '97', '0'], Node);
      expect(newAsks.next.next.value).toEqual(['103', '1']);
      expect(newBids.next.next.value).toEqual(['95', '1']);
    });
  });
});