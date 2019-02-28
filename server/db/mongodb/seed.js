const db = require('./index.js');
const faker = require('faker');
const path = require('path');
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

let newProduct = new Product({
  productName: faker.commerce.productName(),
  originalPrice: genDollarsCents(),
  lightningDeal: ...getLightningDeal(),
  // TODO: REPLACE NEXT THREE LINES WITH RESULTS OF ...multiplePricing(),
  salesPercent: Number,
  pricingOptionOne: String,
  pricingOptionTwo: String,
  owningCompany: faker.company.companyName(),
  fulfilledBy: faker.company.companyName(),
  numInStock: randStockNum,
  primeEligible: !!genRandomInt(0, 1),
  returnable: !!genRandomInt(0, 1),
  giftWrapAvaile: !!genRandomInt(0, 1),
  buyUsed: !!genRandomInt(0, 1),
  usedPrice: ...getUsedPrice(),
  // TODO: REPLACE NEXT FOUR LINES WITH RESULTS OF ...protectionPlan(),
  protectionPlan: {type: Boolean, default: false},
  protectionPlanPricingOptionOne: String,
  protectionPlanPricingOptionTwo: String,
  protectionPlanDescription: String
});

let newReview = new Review({
  reviewCount: genRandomInt(0, 801),
  stars: genRandomInt(0, 5)
});

newReview.save();