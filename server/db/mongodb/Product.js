const mongoose = require('mongoose');
const db = require('./index.js');

const productSchema = new mongoose.Schema({
  /* TODO: Translate from SQL to MongoDB
  ======================================
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productName VARCHAR NOT NULL,
  originalPrice VARCHAR NOT NULL,
  lightningDeal BOOLEAN DEFAULT false,
  salesPercent INTEGER DEFAULT NULL,
  pricingOptionOne VARCHAR DEFAULT NULL,
  pricingOptionTwo VARCHAR DEFAULT NULL,
  owningCompany VARCHAR NOT NULL,
  fulfilledBy VARCHAR NOT NULL,
  numInStock INTEGER NOT NULL,
  primeEligible BOOLEAN DEFAULT true,
  returnable BOOLEAN DEFAULT false,
  giftWrapAvail BOOLEAN DEFAULT true,
  buyUsed BOOLEAN DEFAULT false,
  usedPrice VARCHAR NULL,
  protectionPlan BOOLEAN DEFAULT false,
  protectionPlanPricingOptionOne VARCHAR NULL,
  protectionPlanPricingOptionTwo VARCHAR NULL,
  protectionPlanDescription TEXT NULL
  */
},
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;