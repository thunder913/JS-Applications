const expect = require("chai").expect;
const isOddOrEven = require("./isOddorEven");

describe('isOddorEven', function(){
    it('should return undefined with a non string paramenter', function(){
        expect(isOddOrEven(13)).to.equal(undefined, 'Function did not return the correct result!');
        expect(isOddOrEven({name: "Ivan"})).to.equal(undefined, 'Function did not return the correct result!');
    });
    it('should return even when the length is even number', function(){
        expect(isOddOrEven('Even')).to.equal('even', 'Function did not return the correct result!');
    });
    it('should return odd when the length is odd number', function(){
        expect(isOddOrEven('Odd')).to.equal('odd', 'Function did not return the correct result!');
    });
    it('should return correct values with multiple checks', function(){
        expect(isOddOrEven('cat')).to.equal('odd', 'Function did not return the correct result!');
        expect(isOddOrEven('something')).to.equal('odd', 'Function did not return the correct result!');
        expect(isOddOrEven('pill')).to.equal('even', 'Function did not return the correct result!');
        expect(isOddOrEven('soft')).to.equal('even', 'Function did not return the correct result!');
    })
})



