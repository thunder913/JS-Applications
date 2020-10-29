const stringBuilder = require('./string-builder');
const assert = require('chai').assert;

describe('stringBuilder', ()=>{
    describe('constructor', ()=>{
        it('should throw exception when the argument is not a string', ()=>{
            assert.throws(()=> new stringBuilder(123));
            assert.throws(()=> new stringBuilder(true));
        });
        it('should work correctly when given a string', ()=>{
            assert.doesNotThrow(()=>new stringBuilder('text'));
        });
        it('should work correctly when instantiated without arguments', ()=>{
            assert.doesNotThrow(()=>new stringBuilder());
        });
    });
    describe('append', ()=>{
        it('should throw exception when the argument is not a string', ()=>{
            let sb = getStringBuilder();
            assert.throws(()=> sb.append(123));
            assert.throws(()=> sb.append(true));
        });
        it('should append the word when the argument is valid', ()=>{
            let sb = getStringBuilder();
            sb.append(' World');
            assert.equal(sb.toString(), 'Hello World');
            sb.append('!');
            assert.equal(sb.toString(), 'Hello World!');
        });
    });
    describe('prepend', ()=>{
        it('should throw exception when the argument is not a string', ()=>{
            let sb = getStringBuilder();
            assert.throws(()=> sb.prepend(123));
            assert.throws(()=> sb.prepend(false));
        });
        it('should append the work at the beginning when the argument is valid', ()=>{
            let sb = getStringBuilder();
            sb.prepend('H');
            assert.equal(sb.toString(), 'HHello');
            sb.prepend('Hello ');
            assert.equal(sb.toString(), 'Hello HHello');
        });
    });
    describe('insertAt',()=>{
        it('should throw exception when the argument is not a string', ()=>{
            let sb = getStringBuilder();
            assert.throws(() => sb.insertAt(123, 1));
            assert.throws(() => sb.insertAt(false, 1));
        });
        it('should add the work at the index given', ()=>{
            let sb = getStringBuilder();
            sb.insertAt('H', 0);
            assert.equal(sb.toString(), 'HHello');
            sb.insertAt('o', 5);
            assert.equal(sb.toString(), 'HHelloo');
        });
        it('should work correctly when index is out of bounds', ()=>{
            let sb = getStringBuilder();
            sb.insertAt('o', 10);
            assert.equal(sb.toString(), 'Helloo');
            sb.insertAt('H', -5);
            assert.equal(sb.toString(), 'HHelloo');
        });
    });
    describe('remove', ()=>{
        it('should work correctly when indexes are in bound', ()=>{
            let sb = getStringBuilder();
            sb.remove(4,1);
            assert.equal(sb.toString(), 'Hell');
            sb.remove(0,2);
            assert.equal(sb.toString(),'ll');
        });
        it('should work correctly when the indexes are not in the bounds', ()=>{
            let sb = getStringBuilder();
            sb.remove(10, 20);
            assert.equal(sb.toString(), 'Hello');
            sb.remove(-2, 2);
            assert.equal(sb.toString(), 'Hel');
        });
    })
    describe('toString', ()=>{
        it('works correctly', ()=>{
            let sb = new stringBuilder('Hello');
            assert.equal(sb.toString(), 'Hello');
        })
    });
})

function getStringBuilder(){
    return new stringBuilder('Hello');
}