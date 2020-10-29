const assert = require('chai').assert;
const isOddOrEven = require('./isOddOrEven');

describe('isOddOrEven', ()=>{
    it('should return odd when given odd length string', ()=>{
        assert.equal(isOddOrEven('odd'), 'odd');
    })
    it('should return even when given even length string', ()=>{
        assert.equal(isOddOrEven('even'), 'even');
    })
    it('should return undefined if not given a string', ()=>{
        assert.equal(isOddOrEven(123), undefined);
        assert.equal(isOddOrEven(true), undefined);
    })
    it('works correctly with multiple checks', ()=>{
        assert.equal(isOddOrEven('test'), 'even');
        assert.equal(isOddOrEven(1), undefined);
        assert.equal(isOddOrEven('notodd'), 'even');
        assert.equal(isOddOrEven('test1'), 'odd');
        assert.equal(isOddOrEven('evennn'), 'even');
        assert.equal(isOddOrEven(913), undefined);
    })
})
