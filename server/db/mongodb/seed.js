// const faker = require('faker');
const path = require('path');
const now = require('performance-now');

// const genRandomInt = require(path.join(__dirname, '../../../server/utils/genRandInt'));
// const { Product } = require('../../../server/db/mongodb/Product.js');
const { Review } = require('../../../server/db/mongodb/Review.js');
// const {
//   moneyDelimValues,
//   genDollarsCents,
//   getLightningDeal,
//   multiplePricing,
//   getUsedPrice,
//   protectionPlan,
// } = require('../utils/seedHelpers');
// const randStockNum = genRandomInt(1, 900);

// let pricingOptions = multiplePricing();
// let plan = protectionPlan();
// let deal = getLightningDeal();
// let productName = faker.commerce.productName();
// let originalPrice = genDollarsCents();
// let companyName = faker.company.companyName();


// let makeProduct = function () {
//   let newProduct = new Product({
//     productName: productName,
//     originalPrice: originalPrice,
//     // lightningDeal: deal[0],
//     salesPercent: deal[1],
//     pricingOptionOne: pricingOptions[0],
//     pricingOptionTwo: pricingOptions[1],
//     owningCompany: companyName,
//     fulfilledBy: companyName,
//     numInStock: randStockNum,
//     // primeEligible: true,
//     // returnable: true,
//     // giftWrapAvaile: true,
//     // buyUsed: true,
//     usedPrice: originalPrice,
//     // protectionPlan: plan[0],
//     protectionPlanPricingOptionOne: plan[1],
//     protectionPlanPricingOptionTwo: plan[2],
//     protectionPlanDescription: plan[2]
//   });  
//   return newProduct;
// }

let makeReview = function () {
  let newReview = new Review({
    // reviewCount: genRandomInt(0, 50),
    reviewCount: 10,
    stars: 0
    // stars: genRandomInt(0, 5)
  });
  return newReview;
}


let MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/amazon-cart', (err, db) => {
  if (err) {
    return console.log(err);
  }
  console.log('Connected To DB');

  let documents = [];

  // track starting time for seeding
  let startTime01 = now();

  for (let records = 0; records < 500000; records++) {
    documents.push(makeReview());  
  }

  Review.insertMany(documents, {ordered: false}, (error, docs) => {
    // track ending time for seeding
    // console.log(process.memoryUsage());
    // console.log(`Database seeding took ${now() - startTime01}ms`);

    if (error) {
      return error;
    } else {
      documents = null;
      console.log(`${docs.length} documents saved to database`);
    }
  });


  let documents02 = [];

  for (let records = 0; records < 500000; records++) {
    documents02.push(makeReview());  
  }

  Review.insertMany(documents02, {ordered: false}, (error, docs) => {
    // track ending time for seeding
    // console.log(process.memoryUsage());
    // console.log(`Database seeding took ${now() - startTime01}ms`);

    if (error) {
      return error;
    } else {
      documents02 = null;
      console.log(`${docs.length} documents saved to database`);
    }
  });




  let documents03 = [];

  for (let records = 0; records < 500000; records++) {
    documents03.push(makeReview());  
  }

  Review.insertMany(documents03, {ordered: false}, (error, docs) => {
    // track ending time for seeding
    // console.log(process.memoryUsage());
    console.log(`Database seeding took ${now() - startTime01}ms`);

    if (error) {
      return error;
    } else {
      documents03 = null;
      console.log(`${docs.length} documents saved to database`);
    }
  });


  db.close();
});
