const mongoose = require('mongoose');
const db = require('./index.js');

const productSchema = new mongoose.Schema({
  productName: String,
  originalPrice: String,
  lightningDeal: {type: Boolean, default: false},
  salesPercent: Number,
  pricingOptionOne: String,
  pricingOptionTwo: String,
  owningCompany: String,
  fulfilledBy: String,
  numInStock: Number,
  primeEligible: {type: Boolean, default: true},
  returnable: {type: Boolean, default: false},
  giftWrapAvaile: {type: Boolean, default: true},
  buyUsed: {type: Boolean, default: false},
  usedPrice: String,
  protectionPlan: {type: Boolean, default: false},
  protectionPlanPricingOptionOne: String,
  protectionPlanPricingOptionTwo: String,
  protectionPlanDescription: String
},
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;