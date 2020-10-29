const mathEnforcer = require('./mathEnforcer');
const assert = require('chai').assert;

describe('mathEnforcer', ()=>{
    describe('addFive', ()=>{
        it('should return undefined when given not a number', ()=>{
            assert.equal(mathEnforcer.addFive('2'), undefined);
            assert.equal(mathEnforcer.addFive('notNumber'), undefined);
        })
        it('should work correctly when given a number', ()=>{
            assert.equal(mathEnforcer.addFive(2), 7);
            assert.equal(mathEnforcer.addFive(-5), 0);
            assert.closeTo(mathEnforcer.addFive(4.22), 9.22, 0.00000000000001);
        })
    })
    describe('substractTen', ()=>{
        it('should return undefined when given not a number', ()=>{
            assert.equal(mathEnforcer.subtractTen('2'), undefined);
            assert.equal(mathEnforcer.subtractTen('notNumber'), undefined);
        })
        it('should work correctly when given a number', ()=>{
            assert.equal(mathEnforcer.subtractTen(2), -8);
            assert.equal(mathEnforcer.subtractTen(-5), -15);
            assert.closeTo(mathEnforcer.subtractTen(4.22), -5.78, 0.00000000000001);
        })
    })
    describe('sum', ()=>{
        it('should return undefined when given not a number', ()=>{
            assert.equal(mathEnforcer.sum('1', 2), undefined);
            assert.equal(mathEnforcer.sum(2, '1'), undefined);
            assert.equal(mathEnforcer.sum('NaN', 'NaN'), undefined);
        });
        it('should return the sum if the elements are numbers', ()=>{
            assert.equal(mathEnforcer.sum(5,7), 12);
            assert.equal(mathEnforcer.sum(12.2, 13), 25.2)
        })
    });
})
