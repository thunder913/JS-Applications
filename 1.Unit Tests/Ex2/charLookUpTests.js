const expect = require('chai').expect;
const charLookUp = require('./charLookUp');

describe('charLookUp', function(){
    it('should return undefined when the first paramenter is not a string', function(){
        expect(charLookUp(12345, 2)).to.equal(undefined);
        expect(charLookUp(undefined, 2)).to.equal(undefined);
    });
    it('should return undefined when the second paramenter is NaN', function(){
        expect(charLookUp('Test', NaN)).to.equal(undefined);
        expect(charLookUp('Test', '2')).to.equal(undefined);
        expect(charLookUp('Test', 3.14)).to.equal(undefined);
    });
    it('should return \'Incorrect index\' when index is higher than string lenght', function(){
        expect(charLookUp('Test', 4)).to.equal('Incorrect index');
    });
    it('should return \'Incorrect index\' when index is a negative number', function(){
        expect(charLookUp('Test', -1)).to.equal('Incorrect index');
    });
    it('should return correct values with multiple checks', function(){
        expect(charLookUp('Test',0)).to.equal('T');
        expect(charLookUp('Test',1)).to.equal('e');
        expect(charLookUp('Test',2)).to.equal('s');
        expect(charLookUp('Test',3)).to.equal('t');
    });
})