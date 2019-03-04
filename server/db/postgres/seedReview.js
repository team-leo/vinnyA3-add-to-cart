// const pg = require('pg');
const { Pool, Client } = require('pg');
const path = require('path');
const now = require('performance-now');
const config = require(path.join(__dirname, '../../../server/config/postgres/config'));
const genRandomInt = require(path.join(__dirname, '../../../server/utils/genRandInt'));

let pool = new Pool(config);

pool.query('CREATE TABLE reviews(id SERIAL PRIMARY KEY, reviewCount INTEGER, stars INTEGER DEFAULT 0)', (err, res) => {
    console.log(err ? err.stack : res);
    console.log(`${now()}ms`);
});

// const client = new Client(config);
// client.connect();

let startTime = now();

for (let index = 0; index < 10000; index++) {
    pool.query('INSERT INTO reviews(reviewCount, stars) VALUES($1, $2)', [genRandomInt(0, 801), genRandomInt(0, 5)], (err, results) => {
        if (err) {
            console.log(err);
            console.log(`${now()}ms`);
        } else {
            console.log(results.rows);
        }
    });
}

pool.end(() => {
  console.log('pool has ended');
  console.log(`${now() - startTime}ms`);
})