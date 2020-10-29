const console = require('./console');
const assert = require('chai').assert;

describe('console', ()=>{
    it('works correctly with a string argument', ()=>{
        let text = 'test';
        assert.equal(console.writeLine(text), text);
    })
    it('works correctly with an object', ()=>{
        let obj = {Name: 'Ivan', Age:15};
        let json = JSON.stringify(obj);
        assert.equal(console.writeLine(obj), json);
    })
    it('throws exception when the first argument is not a string', ()=>{
        assert.throws(()=>console.writeLine(2, 'test'), 'No string format given!');
        assert.throws(()=>console.writeLine(true, 'test'), 'No string format given!');
    })
    it('throws an exception when there are more parameters', ()=>{
        assert.throws(()=>console.writeLine('The sum of {0} and {1} is {2}', 3, 4, 7,6), 'Incorrect amount of parameters given!');
        assert.throws(()=>console.writeLine('The sum of {0} and {1} is {2}', 3, 4, 7,6,11), 'Incorrect amount of parameters given!');
    })
    it('throws an exception when the placeholders are not in order', ()=>{
        assert.throws(()=>console.writeLine('The sum of {0} and {2} is {5}', 3, 4,3), 'Incorrect placeholders given!');
        assert.throws(()=>console.writeLine('The sum of {1} and {2} is {3}', 3, 4,3), 'Incorrect placeholders given!');
    })
    it('should return undefined when given not a string and not an object', ()=>{
        assert.equal(console.writeLine(213), undefined);
        assert.equal(console.writeLine(true), undefined);
    })
    it('works correctly with multiple checks', ()=>{
        assert.equal(console.writeLine('The sum of {0} and {1} is {2}', 3, 4, 7), 'The sum of 3 and 4 is 7');
        assert.equal(console.writeLine('test'), 'test');
        assert.equal(console.writeLine(42), undefined);
    })
})