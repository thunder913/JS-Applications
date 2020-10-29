const { Assertion } = require('chai');
const paymentPackage = require('./PaymentPackage');
const assert = require('chai').assert;

describe('paymentPackage', ()=>{
    describe('constructor', ()=>{
        it('throws exception when given not a string name', ()=>{
            assert.throws(()=>new paymentPackage(1, 12));
            assert.throws(()=>new paymentPackage(true, 12));
        });
        it('throws exception when given an empty string name', ()=>{
            assert.throws(()=>new paymentPackage('', 12));
        });
        it('throws exception when given NaN value', ()=>{
            assert.throws(()=>new paymentPackage('test', '111'));
            assert.throws(()=>new paymentPackage('test', true));
        });
        it('throws exceptin when the value is a negative number', ()=>{
            assert.throws(()=>new paymentPackage('test', -1));
            assert.throws(()=>new paymentPackage('test', -100));
        });
        it('works correctly when given the right name and value', ()=>{
            let name = 'test'; let value = 12;
            let pp = new paymentPackage(name, value);
            assert(pp.name === name && pp.value === value && pp.VAT === 20 && pp.active === true);
        });
    });
    describe('setName', ()=>{
        it('throws exception when given not a string', ()=>{
        let pp = getPaymentPackage();
        assert.throws(()=>pp.name = 1);
        assert.throws(()=>pp.name = true);
        });
        it('throws exception when given an empty string', ()=>{
            let pp = getPaymentPackage();
            assert.throws(()=>pp.name='');
        });
        it('works correctly',()=>{
            let pp = getPaymentPackage();
            let newName = 'newName';
            pp.name = newName;
            assert.equal(pp.name, newName);
        });
    });
    describe('getName', ()=>{
        it('throws exception when given not a number', ()=>{
            let pp = getPaymentPackage();
            assert.equal(pp.name, 'test');
        })
    })
    describe('setValue', ()=>{
        it('throws exception when given not a number', ()=>{
            let pp = getPaymentPackage();
            assert.throws(()=>pp.value = '1');
            assert.throws(()=>pp.value = true);
        });
        it('throws exception when given not a number', ()=>{
            assert.throws(()=>pp.value = -1);
            assert.throws(()=>pp.value = -100);
        });
        it('works correctly',()=>{
            let pp = getPaymentPackage();
            let newValue = 11;
            pp.value = newValue;
            assert.equal(pp.value, newValue);
        });
    });
    describe('getValue', ()=>{
        it('works correctly', ()=>{
            let pp = getPaymentPackage();
            assert.equal(pp.value, 12);
        });
    });
    describe('setVAT', ()=>{
        it('throws exception when given not a number', ()=>{
            let pp = getPaymentPackage();
            assert.throws(()=>pp.VAT = '12');
            assert.throws(()=>pp.VAT = true);
        });
        it('throws exception when given a negative number', ()=>{
            let pp = getPaymentPackage();
            assert.throws(()=>pp.VAT = -1);
            assert.throws(()=>pp.VAT = -100);
        });
        it('works correctly', ()=>{
            let pp = getPaymentPackage();
            let newVAT = 11;
            pp.VAT = newVAT;
            assert.equal(pp.VAT, newVAT);
        });
    });
    describe('getVAT', ()=>{
        it('works correctly',()=>{
            let pp = getPaymentPackage();
            assert.equal(pp.VAT, 20);
            let newVAT = 50;
            pp.VAT = newVAT;
            assert.equal(pp.VAT, newVAT);
        });
    });
    describe('setActive',()=>{
        it('throws exception when given not a boolean', ()=>{
            let pp = getPaymentPackage();
            assert.throws(()=> pp.active = 'false');
            assert.throws(()=> pp.active = 1);
        });
        it('works correctly', ()=>{
            let pp = getPaymentPackage();
            assert.equal(pp.active, true);
            pp.active = false;
            assert.equal(pp.active, false);
        });
    });
    describe('getActive', ()=>{
        it('works correctly', ()=>{
            let pp = getPaymentPackage();
            assert.equal(pp.active, true);
        });
    });
    describe('toString', ()=>{
        it('works correctly', ()=>{
            let pp = getPaymentPackage();
            const output = [
                `Package: ${pp.name}` + (pp.active === false ? ' (inactive)' : ''),
                `- Value (excl. VAT): ${pp.value}`,
                `- Value (VAT ${pp.VAT}%): ${pp.value * (1 + pp.VAT / 100)}`
              ];
              assert.equal(pp.toString(), output.join('\n'));

              pp.value = 55;
              pp.active = false;
              pp.name = 'newName';
              pp.VAT = 99;
              let output2 = [
                `Package: ${pp.name}` + (pp.active === false ? ' (inactive)' : ''),
                `- Value (excl. VAT): ${pp.value}`,
                `- Value (VAT ${pp.VAT}%): ${pp.value * (1 + pp.VAT / 100)}`
              ];
              assert.equal(pp.toString(), output2.join('\n'));
        })
    })
})

function getPaymentPackage(){
    return new paymentPackage('test', 12);
}