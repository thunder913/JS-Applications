const charLookUp = require('./charLookUp');
const assert = require('chai').assert;

describe('charLookUp', ()=>{
    it('should return undefined when the first parameter is not a string',()=>{
        assert.equal(charLookUp(1, 1), undefined);
        assert.equal(charLookUp(true, 1), undefined);
    })
    it('should return undefined when the second parameter is not a number',()=>{
        assert.equal(charLookUp('text', 'not a number'), undefined);
        assert.equal(charLookUp('text', NaN), undefined);
    })
    it('should return undefined when the index is bigger than the string length',()=>{
        assert.equal(charLookUp('text', 4), 'Incorrect index');
        assert.equal(charLookUp('text', 10), 'Incorrect index');
    })
    it('should return undefined when the index is a negative number',()=>{
        assert.equal(charLookUp('text', -1), 'Incorrect index');
        assert.equal(charLookUp('text', -50), 'Incorrect index');
    })
    it('should work correctly with given correct values', ()=>{
        assert.equal(charLookUp('text', 0), 't');
        assert.equal(charLookUp('text', 2), 'x');
    })
    it('works correctly with multiple checks', ()=>{
        assert.equal(charLookUp('text', 0), 't');
        assert.equal(charLookUp(1, 1), undefined);
        assert.equal(charLookUp('some', 3), 'e');
        assert.equal(charLookUp('text', -1), 'Incorrect index');
        assert.equal(charLookUp('text', 'not a number'), undefined);
        assert.equal(charLookUp('text', 5), 'Incorrect index');
        assert.equal(charLookUp('something', 1), 'o');
    })
})
