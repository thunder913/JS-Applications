const expect = require('chai').expect;
const Warehouse = require('./Warehouse');

describe('Warehouse', function(){
    describe('constructor', function(){
        it('throws exception when the capacity is not a number', function(){
            expect(()=> new Warehouse('1')).to.throw('Invalid given warehouse space');
        });
        it('throws exception when the capacity is a negative number', function(){
            expect(()=> new Warehouse(-1)).to.throw('Invalid given warehouse space');
        });
        it('throws exception when the capacity is 0', function(){
            expect(()=> new Warehouse(0)).to.throw('Invalid given warehouse space');
        });
        it('works correctly', function(){
            let capacity = 5;
            let warehouse = new Warehouse(capacity);
            expect(warehouse.availableProducts).to.eql( {'Food': {}, 'Drink': {}});
            expect(warehouse.capacity).to.equal(capacity);
        });
    });
    describe('addProduct', function(){
        it('throws exception if there is not enough capacity', function(){
            let warehouse = new Warehouse(5);
            expect(()=>warehouse.addProduct('test', 'test', 6)).to.throw(`There is not enough space or the warehouse is already full`);
        });
        it('works correctly with food', function(){
            let warehouse = new Warehouse(10);
            expect(warehouse.addProduct('Food', 'test', 2)).to.eql({test: 2});
            expect(warehouse.addProduct('Food', 'test', 2)).to.eql({test: 4});
            expect(warehouse.addProduct('Food', 'test', 1)).to.eql({test: 5});
        });
        it('works correctly with drink', function(){
            let warehouse = new Warehouse(10);
            expect(warehouse.addProduct('Drink', 'test', 2)).to.eql({test: 2});
            expect(warehouse.addProduct('Drink', 'test', 2)).to.eql({test: 4});
            expect(warehouse.addProduct('Drink', 'test', 1)).to.eql({test: 5});
        });
    });
    describe('orderProducts', function(){
        it('works correctly with food', function(){
            let warehouse = new Warehouse(15);
            warehouse.addProduct('Drink', 'test2', 2);
            warehouse.addProduct('Drink', 'test3', 1);
            warehouse.addProduct('Drink', 'test1', 3);
            warehouse.addProduct('Food', 'test2', 2);
            warehouse.addProduct('Food', 'test3', 1);
            warehouse.addProduct('Food', 'test1', 3);
            expect(warehouse.orderProducts('Drink')).to.eql({test1: 3, test2: 2, test3: 1});
            expect(warehouse.orderProducts('Food')).to.eql({test1: 3, test2: 2, test3: 1});
        });
    });
    describe('occupiedCapacity', function(){
        it('works correctly', function(){
            let warehouse = new Warehouse(15);
            warehouse.addProduct('Drink', 'test2', 2);
            warehouse.addProduct('Drink', 'test3', 1);
            warehouse.addProduct('Drink', 'test1', 3);
            expect(warehouse.occupiedCapacity()).to.equal(6);
            warehouse.addProduct('Food', 'test', 5);
            expect(warehouse.occupiedCapacity()).to.equal(11);
        });
    });
    describe('revision', function(){
        let warehouse = new Warehouse(20);
        it('works correctly with nothing in the warehouse', function(){
            expect(warehouse.revision()).to.equal('The warehouse is empty');
        });
        it('works correctly with items inside', function(){
            warehouse.addProduct('Drink', 'test2', 2);
            warehouse.addProduct('Food', 'test', 5);
            warehouse.addProduct('Drink', 'test3', 1);
            expect(warehouse.revision()).to.equal('Product type - [Food]' + 
            '\n- test 5' +
            '\nProduct type - [Drink]' +
            '\n- test2 2' +
            '\n- test3 1');
        });
    });
    describe('scrapeAProduct', function(){
        
        it('works when the product is inexistant', function(){
            let warehouse = new Warehouse(30);
            warehouse.addProduct('Food', 'test', 2);
            let productName = 'test2';
            expect(()=>warehouse.scrapeAProduct(productName, 3)).to.throw( `${productName} do not exists`);
            expect(()=>warehouse.scrapeAProduct('', 3)).to.throw( ` do not exists`);
        });
        it('works correctly when the product quantity is more than the removed quantity', function(){
            let warehouse = new Warehouse(30);
            warehouse.addProduct('Food', 'test', 2);
            expect(warehouse.scrapeAProduct('test', 3)).to.eql({test: 0});
            expect(warehouse.scrapeAProduct('test', 5)).to.eql({test: 0});
        });
        it('works correctly when the product quantity is less than the removed quantity', function(){
            let warehouse = new Warehouse(30);
            warehouse.addProduct('Food', 'test', 20);
            expect(warehouse.scrapeAProduct('test', 5)).to.eql({test: 15});
            expect(warehouse.scrapeAProduct('test', 7)).to.eql({test: 8});
        });
    });
});