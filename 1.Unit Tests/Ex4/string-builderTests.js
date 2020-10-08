const expect = require('chai').expect;
const StringBuilder = require('./string-builder');

describe('string-builder', function(){
    describe('constructor', function(){
        it('should work correctly with string and without anything', function(){
            expect(()=>new StringBuilder(123)).to.throw(TypeError, 'Argument must be string');
            expect(()=> new StringBuilder('test')).to.not.throw();
            expect(()=> new StringBuilder()).to.not.throw();
        });
    });
    describe('append', function(){
        it('works correctly with a given string', function(){
            let sb = new StringBuilder('Hello');
            sb.append(' person');
            expect(sb.toString()).to.equal('Hello person');
        });
        it('throws exception when input is not a string', function(){
            let sb = new StringBuilder();
            expect(()=>sb.append(123)).to.throw(TypeError, 'Argument must be string');
        });
    });
    describe('prepend', function(){
        it('works correctly with a given string', function(){
            let sb = new StringBuilder(' person');
            sb.prepend('Hello');
            expect(sb.toString()).to.equal('Hello person');
        });
        it('throws exception when input is not a string', function(){
            let sb = new StringBuilder();
            expect(()=>sb.prepend(123)).to.throw(TypeError, 'Argument must be string');
        });
    });
    describe('insertAt', function(){
        it('works correctly with given inputs', function(){
            let sb = new StringBuilder('Hello friend');
            sb.insertAt(' good', 5);
            expect(sb.toString()).to.equal('Hello good friend');
        });
        it('throws exception when input is not a string', function(){
            let sb = new StringBuilder();
            expect(()=>sb.insertAt(123,1)).to.throw(TypeError, 'Argument must be string');
        });
    });
    describe('remove', function(){
        it('removes the elements from the startIndex and the given length', function(){
            let sb = new StringBuilder('Hello good friend');
            sb.remove(5, 5);
            expect(sb.toString()).to.equal('Hello friend');
        });
    });
    describe('toString', function(){
        it('returns empty string from an empty constructor', function(){
            let sb = new StringBuilder();
            expect(sb.toString()).to.equal('');
        });
        it('works with multiple tests',function(){
            let sb = new StringBuilder('Hello');
            expect(sb.toString()).to.equal('Hello');
            sb.append(' Ivan');
            expect(sb.toString()).to.equal('Hello Ivan');
            sb.prepend('123');
            expect(sb.toString()).to.equal('123Hello Ivan');
            sb.remove(0,3);
            expect(sb.toString()).to.equal('Hello Ivan');
        });
    });
})
