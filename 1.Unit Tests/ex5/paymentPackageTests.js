const expect = require('chai').expect;
const paymentPackage = require('./PaymentPackage');

describe('PaymentPackage', function(){
    describe('constructor', function(){
        it('should throw exception when name is not a string', function(){
            expect(()=> new paymentPackage(123, 123)).to.throw(Error, 'Name must be a non-empty string');
        });
        it('should throw exception when name is an empty string', function(){
            expect(()=> new paymentPackage('', 123)).to.throw(Error, 'Name must be a non-empty string');
        });
        it('should throw exception when value is not a number', function(){
            expect(()=> new paymentPackage('Test', '1')).to.throw(Error, 'Value must be a non-negative number');
        });
        it('should throw exception when value is a negative number', function(){
            expect(()=> new paymentPackage('Test', -1)).to.throw(Error, 'Value must be a non-negative number');
        });
        it('works correctly with multiple tests', function(){
            let package1 = new paymentPackage('Test', 123);
            expect(package1.name).to.equal('Test');
            expect(package1.value).to.equal(123);

            let package2 = new paymentPackage('T', 0);
            expect(package2.name).to.equal('T');
            expect(package2.value).to.equal(0);
        });
    });
    describe('getName', function(){
        it('works correctly', function(){
            let package = new paymentPackage('Name', 1);
            expect(package.name).to.equal('Name');
        })
    });
    describe('setName', function(){
        let package = new paymentPackage('Name', 1);
        it('throws exception when given a non string value', function(){
           expect(()=>package.name = 123).to.throw(Error,'Name must be a non-empty string'); 
        });
        it('throws exception when given an empty string', function(){
            expect(()=> package.name = '').to.throw(Error, 'Name must be a non-empty string');
        });
        it('works correctly', function(){
            let name = 'newName';
            package.name = name;
            expect(package.name).to.equal(name);
        });
    });
    describe('getValue', function(){
        it('works correctly', function(){
            let package = new paymentPackage('Name', 1);
            expect(package.value).to.equal(1);
        });
    });
    describe('setValue', function(){
        let package = new paymentPackage('Name', 1);
        it('throws exception when given not a number', function(){
            expect(()=> package.value = '1').to.throw(Error, 'Value must be a non-negative number');
        });
        it('throws exception when given a negative number', function(){
            expect(()=> package.value = -1).to.throw(Error, 'Value must be a non-negative number');
        });
        it('works correctly', function(){
            let value = 42;
            package.value = value;
            expect(package.value).to.equal(value);
        });
    });
    describe('getVAT', function(){
        it('works correctly when instantiated with the constructor\'s default value',function(){
            let package = new paymentPackage('Name', 123);
            let defaultValue = 20;
            expect(package.VAT).to.equal(defaultValue);
        });
    });
    describe('setVAT', function(){
        let package = new paymentPackage('Name', 123);
        it('throws exception when the value is not a number', function(){
            expect(()=> package.VAT = '20').to.throw(Error, 'VAT must be a non-negative number');
        });
        it('throws exception when the value is a negative number', function(){
            expect(()=> package.VAT = -1).to.throw(Error, 'VAT must be a non-negative number');
        });
        it('works correctly', function(){
            let vat = 42;
            package.VAT = vat;
            expect(package.VAT).to.equal(vat);
        })
    });
    describe('getActive', function(){
        it('works correctly', function(){
            let package = new paymentPackage('Name', 123);
            expect(package.active).to.equal(true);
        });
    });
    describe('setActive', function(){
        let package = new paymentPackage('Name', 123);
        it('works correctly when instantiated with the constructor\'s default value', function(){
            expect(package.active).to.equal(true);
        });
        it('throws exception when given not a boolean', function(){
            expect(()=> package.active = 1).to.throw(Error, 'Active status must be a boolean');
            expect(()=> package.active = 'true').to.throw(Error, 'Active status must be a boolean');
            expect(()=> package.active = []).to.throw(Error, 'Active status must be a boolean');
        });
        it('works correctly', function(){
            let newValue = false;
            package.active = newValue;
            expect(package.active).to.equal(newValue);
        });
    });
    describe('toString', function(){
        it('works correctly', function(){
            let package = new paymentPackage('Name', 123);
            expect(package.toString()).to.equal(`Package: ${package.name}`+
            `\n- Value (excl. VAT): ${package.value}`+
            `\n- Value (VAT ${package.VAT}%): ${package.value*(package.VAT/100+1)}`);

            let vat = 42;
            let name = 'newName'
            package.VAT = vat;
            package.name = name
            expect(package.toString()).to.equal(`Package: ${name}`+
            `\n- Value (excl. VAT): ${package.value}`+
            `\n- Value (VAT 42%): ${package.value*(vat/100+1)}`);
        });
    });
})