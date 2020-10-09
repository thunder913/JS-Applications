const expect = require('chai').expect;
const Console = require('./specialConsole');


describe('specialConsole', function(){
    it('works correctly with a string argument', function(){
        let argument = 'This is a test message!';
        expect(Console.writeLine(argument)).to.equal(argument);
    });
    it('works correctly with object argument', function(){
        let object = {object: {param1:1, param2: 'test2'}};
        expect(Console.writeLine(object)).to.equal(JSON.stringify(object));
    });
    it('returns undefined when the input is not a string', function(){
        expect(Console.writeLine(123)).to.equal(undefined);
    });
    it('throws exception when the first argument is not a string', function(){
        expect(()=> Console.writeLine(123,'3')).to.throw(TypeError, 'No string format given!');
        expect(()=> Console.writeLine(123,3, 3)).to.throw(TypeError, 'No string format given!');
        expect(()=> Console.writeLine(true, 1)).to.throw(TypeError, 'No string format given!');
    });
    it('throws exception when there are more tokens than placeholders', function(){
        expect(()=> Console.writeLine('{0} {1}', 1)).to.throw(RangeError, 'Incorrect amount of parameters given!');
        expect(()=> Console.writeLine('{0} {1}', 1,2,3)).to.throw(RangeError, 'Incorrect amount of parameters given!');        
    });
    it('throws exception when there are more placeholders than tokens', function(){
        expect(()=> Console.writeLine('{0} {1} {3}', 1, 2, 3)).to.throw(RangeError, 'Incorrect placeholders given!');
        expect(()=> Console.writeLine('{1}', 1)).to.throw(RangeError, 'Incorrect placeholders given!');
        expect(()=> Console.writeLine('{0} {1} {1}', 1,2,3)).to.throw(RangeError, 'Incorrect placeholders given!');
        
    });
    it('works correctly with templateString and parameters', function(){
        expect(Console.writeLine('The sum of {0} and {1} is {2}', 3, 4, 7)).to.equal('The sum of 3 and 4 is 7');
        expect(Console.writeLine('{0}', 'test')).to.equal('test');
    });
});