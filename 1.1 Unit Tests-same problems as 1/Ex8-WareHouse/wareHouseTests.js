const { reporters } = require('mocha');
const Warehouse = require('./WareHouse');
const WareHouse = require('./WareHouse');
const assert = require('chai').assert;

describe('wareHouse', ()=>{
    describe('constructor', ()=>{
        it('throws exception when given not a number', ()=>{
            assert.throws(()=> new WareHouse('asd'));
            assert.throws(()=> new WareHouse('1'));
            assert.throws(()=> new WareHouse(true));
        })
        it('throws exception when given a negative number or 0', ()=>{
            assert.throws(()=>new WareHouse(-1));
            assert.throws(()=>new WareHouse(0));
        })
        it('works correctly when given a positive number', ()=>{
            let wh = getWareHouse();
            assert.equal(wh.capacity, 10);
        })
    });
    describe('addProduct', ()=>{
        let type = 'Food'
        let product = 'Water';
        let quantity = 5;
        it('works correctly when adding one product', ()=>{
        let wh = getWareHouse();
        let addedProduct = wh.addProduct(type, product, quantity);
        assert.deepEqual(addedProduct, {[product]: quantity});
        })
        it('works correctly when adding an existing product', ()=>{
            let wh = getWareHouse();
            wh.addProduct(type,product,quantity);
            let addedProduct = wh.addProduct(type,product,quantity);
            assert.deepEqual(addedProduct, {[product]: quantity*2});
        })
        it('throws exception when there is not enought space for a newly added product', ()=>{
            let wh = getWareHouse();
            assert.throws(()=>wh.addProduct(type,product, 11), 'There is not enough space or the warehouse is already full');
        })
        it('throws exception when adding another product and the sum is higher than capacity', ()=>{
            let wh = getWareHouse();
            wh.addProduct(type,product,quantity);
            assert.throws(()=>wh.addProduct(type,product,6), 'There is not enough space or the warehouse is already full');
        })
        it('works correctly with food', ()=>{
            let wh = getWareHouse();
            let foodName = 'Donut'
            assert.deepEqual(wh.addProduct('Food', foodName, 2), {[foodName]:2});
            assert.deepEqual(wh.addProduct('Food', foodName, 3), {[foodName]:5});
            assert.deepEqual(wh.addProduct('Food', foodName, 4), {[foodName]:9});
        })
        it('works correctly with drink', ()=>{
            let wh = getWareHouse();
            let drinkName = 'Water'
            assert.deepEqual(wh.addProduct('Drink', drinkName, 2), {[drinkName]:2});
            assert.deepEqual(wh.addProduct('Drink', drinkName, 3), {[drinkName]:5});
            assert.deepEqual(wh.addProduct('Drink', drinkName, 4), {[drinkName]:9});
        })
    })
    describe('orderProducts', ()=>{
        it('works correctly', ()=>{
            let wh = getWareHouse();
            wh.addProduct('Food', 'Snack', 1);
            wh.addProduct('Food', 'Mcdonalds', 5);
            wh.addProduct('Food', 'Banitsa', 3);
            wh.addProduct('Drink', 'Water', 1)
            let expectedResult = {Mcdonalds: 5, Banitsa: 3, Snack: 1};

            assert.deepEqual(wh.orderProducts('Food'), expectedResult);
            assert.deepEqual(wh.orderProducts('Drink'), {Water:1});
        })
    })
    describe('occupiedProducts', ()=>{
        it('works correctly',()=>{
            let wh = getWareHouse();
            wh = addTwoProducts(wh);
            let expectedResult = 7;
            assert.equal(wh.occupiedCapacity(), expectedResult);
            wh.addProduct('Drink', 'Water', 2);
            expectedResult += 2;
            assert.equal(wh.occupiedCapacity(), expectedResult);
        })
    })
    describe('revision', ()=>{
        it('works correctly when there are added products', ()=>{
            let wh = getWareHouse();
            wh = addTwoProducts(wh);
            wh.addProduct('Drink', 'Water', 1);
            let expectedResult = ['Product type - [Food]', '- Banitsa 4', '- Baklava 3', 'Product type - [Drink]', '- Water 1'];
            assert.equal(wh.revision(), expectedResult.join('\n'));
        })
        it('works correctly when the warehouse is empty', ()=>{
            let wh = getWareHouse();
            assert.equal(wh.revision(), 'The warehouse is empty');
        })
    })
    describe('scrapeAProduct', ()=>{
        let wh = getWareHouse();
        wh.addProduct('Food', 'Water','5');
        it('works correctly when the scrape quantity is less than the product quantity', ()=>{
            assert.deepEqual(wh.scrapeAProduct('Water',3), {'Water':2});
        })
        it('works correctly when the scrape quantity is more than the product quantity', ()=>{
            assert.deepEqual(wh.scrapeAProduct('Water', 10), {'Water':0});
        })
        it('works correctly when there is no such product in the warehouse', ()=>{
            let product = 'Donut'
            assert.throw(()=>wh.scrapeAProduct(product, 50), `${product} do not exists`)
        })
    })
})

function addTwoProducts(warehouse){
    warehouse.addProduct('Food', 'Banitsa', 4);
    warehouse.addProduct('Food', 'Baklava', 3);
    return warehouse;
}

function getWareHouse(){
    return new Warehouse(10);
}