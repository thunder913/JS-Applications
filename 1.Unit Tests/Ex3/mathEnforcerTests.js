const mathEnforcer = require('./mathEnforcer');
const expect = require('chai').expect;

describe('mathEnforcer', function(){
    describe('addFive', function(){
        it('should return undefined if given not a number', function(){
            expect(mathEnforcer.addFive('2')).to.equal(undefined);
            expect(mathEnforcer.addFive('asd')).to.equal(undefined);
        });
        it('should work correctly when given a number', function(){
            expect(mathEnforcer.addFive(5)).to.equal(10);
            expect(mathEnforcer.addFive(-24)).to.equal(-19);
            expect(mathEnforcer.addFive(4.32)).to.be.closeTo(9.32,2);
        });
    });
    describe('substractTen', function(){
        it('should return undefined if the given not a number', function(){
            expect(mathEnforcer.subtractTen('2')).to.equal(undefined);
            expect(mathEnforcer.subtractTen('asd')).to.equal(undefined);
        });
        it('should work correctly when given a number', function(){
            expect(mathEnforcer.subtractTen(5)).to.equal(-5);
            expect(mathEnforcer.subtractTen(-24)).to.equal(-34);
            expect(mathEnforcer.subtractTen(4.32)).to.be.closeTo(-6.32,2);
        });
    });
    describe('sum', function(){
        it('should return undefined if given not a number', function(){
            expect(mathEnforcer.sum('1', 2)).to.equal(undefined);
            expect(mathEnforcer.sum(2, '1')).to.equal(undefined);
            expect(mathEnforcer.sum('1', '3')).to.equal(undefined);
            expect(mathEnforcer.sum('asd', 1)).to.equal(undefined);
        });
        it('should work correctly when given numbers', function(){
            expect(mathEnforcer.sum(1,3)).to.equal(4);
            expect(mathEnforcer.sum(-5,2)).to.equal(-3);
            expect(mathEnforcer.sum(3.14, 2.1)).to.be.closeTo(5.24, 2);
        })
    })
})