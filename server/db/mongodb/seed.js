const db = require('./index.js');
const faker = require('faker');
const path = require('path');
const now = require('performance-now');

const genRandomInt = require(path.join(__dirname, '../../../server/utils/genRandInt'));
const { Product } = require('../../../server/db/mongodb/Product.js');
const { Review } = require('../../../server/db/mongodb/Review.js');
const {
  moneyDelimValues,
  genDollarsCents,
  getLightningDeal,
  multiplePricing,
  getUsedPrice,
  protectionPlan,
} = require('../utils/seedHelpers');
const randStockNum = genRandomInt(1, 900);

let pricingOptions;
let plan;
let deal;

let makeProduct = function () {
  pricingOptions = multiplePricing();
  plan = protectionPlan();
  deal = getLightningDeal();

  let newProduct = new Product({
    productName: faker.commerce.productName(),
    originalPrice: genDollarsCents(),
    lightningDeal: deal[0],
    salesPercent: deal[1],
    pricingOptionOne: pricingOptions[0],
    pricingOptionTwo: pricingOptions[1],
    owningCompany: faker.company.companyName(),
    fulfilledBy: faker.company.companyName(),
    numInStock: randStockNum,
    primeEligible: !!genRandomInt(0, 1),
    returnable: !!genRandomInt(0, 1),
    giftWrapAvaile: !!genRandomInt(0, 1),
    buyUsed: !!genRandomInt(0, 1),
    usedPrice: getUsedPrice(),
    protectionPlan: plan[0],
    protectionPlanPricingOptionOne: plan[1],
    protectionPlanPricingOptionTwo: plan[2],
    protectionPlanDescription: plan[2]
  });  
  newProduct.save();
}

let makeReview = function () {
  let newReview = new Review({
    reviewCount: genRandomInt(0, 801),
    stars: genRandomInt(0, 5)
  });
  newReview.save();
}

// console.log('start time:', Date());
let startTime = now();

// console.log('start time:', Date.now());

for (let records = 0; records < 9; records++) {
  makeProduct();
  makeReview();
}

// console.log('end time:', Date());
let endTime = now();
// console.log(`${startTime}ms to ${endTime}ms`);
console.log(`Database seeding took ${endTime - startTime}ms`);
