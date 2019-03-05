const { Pool, Client } = require('pg');
const pgp = require('pg-promise')({capSQL: true});
const cluster = require('cluster');
const path = require('path');
const now = require('performance-now');
const faker = require('faker');
const config = require(path.join(__dirname, '../../../server/config/postgres/config'));
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
  let db = pgp(config);

//   db.query(`CREATE TABLE products(
//     id SERIAL PRIMARY KEY,
//     productName VARCHAR, 
//     originalPrice VARCHAR,
//     lightningDeal BOOLEAN DEFAULT false,    
//     salesPercent INTEGER DEFAULT NULL,
//     pricingOptionOne VARCHAR DEFAULT NULL,
//     pricingOptionTwo VARCHAR DEFAULT NULL,
//     owningCompany VARCHAR NOT NULL,
//     fulfilledBy VARCHAR NOT NULL,
//     numInStock INTEGER NOT NULL,
//     primeEligible BOOLEAN DEFAULT true,
//     returnable BOOLEAN DEFAULT false,
//     giftWrapAvail BOOLEAN DEFAULT true,
//     buyUsed BOOLEAN DEFAULT false,
//     usedPrice VARCHAR NULL,
//     protectionPlan BOOLEAN DEFAULT false,
//     protectionPlanPricingOptionOne VARCHAR NULL,
//     protectionPlanPricingOptionTwo VARCHAR NULL,
//     protectionPlanDescription TEXT NULL)`, (err, res) => {
//     console.log(err ? err.stack : res);
//     console.log(`${now()}ms`);
//   });  

  
  let cs = new pgp.helpers.ColumnSet([
    {name: 'productname'},
    {name: 'originalprice'},
    // {name: 'lightningdeal'},
    {name: 'salespercent'},
    {name: 'pricingoptionone'},
    {name: 'pricingoptiontwo'},
    {name: 'owningcompany'},
    {name: 'fulfilledby'},
    {name: 'numinstock'},
    {name: 'usedprice'},
    {name: 'protectionplanpricingoptionone'},
    {name: 'protectionplanpricingoptiontwo'},
    {name: 'protectionplandescription'}  
  ], {table: 'products'});

  let startTime = now();
  let data = [];
  
  for (let index = 0; index < 2500000; index++) {
    data.push(
        {productname: productName, 
        originalprice: originalPrice,
        // lightningdeal: deal[0],
        salespercent: deal[1],
        pricingoptionone: pricingOptions[0],
        pricingoptiontwo: pricingOptions[1],
        owningcompany: companyName,
        fulfilledby: companyName,
        numinstock: randStockNum,
        usedprice: originalPrice,
        protectionplanpricingoptionone: plan[1],
        protectionplanpricingoptiontwo: plan[2],
        protectionplandescription: plan[3]        
        });
  }

  db.task('inserting-products', t => {
    const insert = pgp.helpers.insert(data, cs);
    return t.none(insert);
  })
  .then(() => {
    console.log(`Success: Database seeding took ${now() - startTime}ms`);
    console.log(`${data.length} records generated`);
  })
  .catch(error => {
    console.log(error);
    console.log(`Operation time: ${now() - startTime}ms`);
  });    
}
