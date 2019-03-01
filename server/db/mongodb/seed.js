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

let pricingOptions = multiplePricing();
let plan = protectionPlan();
let deal = getLightningDeal();
let productName = faker.commerce.productName();
let originalPrice = genDollarsCents();
let companyName = faker.company.companyName();


let makeProduct = function () {
  let newProduct = new Product({
    productName: productName,
    originalPrice: originalPrice,
    lightningDeal: deal[0],
    salesPercent: deal[1],
    pricingOptionOne: pricingOptions[0],
    pricingOptionTwo: pricingOptions[1],
    owningCompany: companyName,
    fulfilledBy: companyName,
    numInStock: randStockNum,
    primeEligible: true,
    returnable: true,
    giftWrapAvaile: true,
    buyUsed: true,
    usedPrice: originalPrice,
    protectionPlan: plan[0],
    protectionPlanPricingOptionOne: plan[1],
    protectionPlanPricingOptionTwo: plan[2],
    protectionPlanDescription: plan[2]
  });  
  return newProduct;
}

let makeReview = function () {
  let newReview = new Review({
    // reviewCount: genRandomInt(0, 50),
    reviewCount: 10,
    stars: 0
    // stars: genRandomInt(0, 5)
  });
  return newReview;
  // newReview.save();
}

db.then(()=> {
  console.log('Connected To DB');

  let documents = [];

  // track starting time for seeding
  let startTime = now();

  for (let records = 0; records < 1000000; records++) {
    documents.push(makeReview());  
  }

  Review.insertMany(documents, {ordered: false}, (error, docs) => {
      // track ending time for seeding
    let endTime = now();
    // console.log(process.memoryUsage());

    // console.log(`${startTime}ms to ${endTime}ms`);
    console.log(`Database seeding took ${endTime - startTime}ms`);

    if (error) {
      return error;
    } else {
      console.log(`${docs.length} documents saved to database`);
      // return docs;
    }
  });

  
}).catch((err) => {
  console.log(err);
});




