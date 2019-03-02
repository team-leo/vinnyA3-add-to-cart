const cluster = require('cluster');
const path = require('path');
const now = require('performance-now');
const faker = require('faker');
const genRandomInt = require(path.join(__dirname, '../../../server/utils/genRandInt'));

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


if (cluster.isMaster) {
  // Count the machine's CPUs
  let cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
  }
  // If worker dies, replace with new worker
  cluster.on('exit', function (worker) {
    console.log('Worker %d has died', worker.id);
    cluster.fork();
  });

} else {
  let makeProduct = function () {
    let newProduct = {
        productName: productName,
        originalPrice: originalPrice,
        // lightningDeal: deal[0],
        salesPercent: deal[1],
        pricingOptionOne: pricingOptions[0],
        pricingOptionTwo: pricingOptions[1],
        owningCompany: companyName,
        fulfilledBy: companyName,
        numInStock: randStockNum,
        // primeEligible: !!genRandomInt(0, 1),
        // returnable: !!genRandomInt(0, 1),
        // giftWrapAvaile: !!genRandomInt(0, 1),
        // buyUsed: !!genRandomInt(0, 1),
        usedPrice: originalPrice,
        // protectionPlan: plan[0],
        protectionPlanPricingOptionOne: plan[1],
        protectionPlanPricingOptionTwo: plan[2],
        protectionPlanDescription: plan[3]
    };
  return newProduct;
}

  let MongoClient = require('mongodb').MongoClient;
  MongoClient.connect('mongodb://localhost:27017/amazon-cart', (err, db) => {
    if (err) throw err;
    console.log('Connected To DB');
    const dbo = db.db('amazon-cart');

    let documents = [];

    // track starting time for seeding
    let startTime01 = now();

    for (let records = 0; records < 2500000; records++) {
      documents.push(makeProduct());  
    }

    dbo.collection("reviews").insertMany(documents, function (err, docs) {
        if (err) throw err;
        console.log(docs.result);
        console.log(`Database seeding took ${now() - startTime01}ms`);
        console.log(process.memoryUsage());
        db.close();
    });

  });  
}
