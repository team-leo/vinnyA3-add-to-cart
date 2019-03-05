const { Pool, Client } = require('pg');
const pgp = require('pg-promise')({capSQL: true});
const path = require('path');
const now = require('performance-now');
const config = require(path.join(__dirname, '../../../server/config/postgres/config'));

let db = pgp({
    host: 'localhost',
    user: 'postgres',
    password: config.password,
    database: 'postgres'
});

let pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: config.password,
    database: 'postgres'
});

pool.query(`DROP DATABASE IF EXISTS amazoncart`, (err, res) => {
    console.log(err ? err.stack : res);
});

pool.query(`CREATE DATABASE amazoncart`, (err, res) => {
    console.log(err ? err.stack : res);
});

db.tx(t => {
    return t.batch([
        t.none(`DROP TABLE IF EXISTS products`),
        t.none(`CREATE TABLE products(id SERIAL PRIMARY KEY,
            productName VARCHAR, 
            originalPrice VARCHAR,
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
            protectionPlanDescription TEXT NULL)`)
    ]);
})
.then(data => {
    console.log('Database table amazoncart created');
})
.catch(error => {
    console.log(error);
});