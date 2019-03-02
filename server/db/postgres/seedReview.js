const pg = require('pg');
const path = require('path');
const now = require('performance-now');
const genRandomInt = require(path.join(__dirname, '../../../server/utils/genRandInt'));

// const client = new Client();

let config = {
    host: 'localhost',
    user: 'postgres',
    password: '*******', // TODO: Replace with environmental variable
    database: 'amazoncart'
};

let pool = new pg.Pool(config);

// client.connect();


pool.query('CREATE TABLE reviews(id SERIAL PRIMARY KEY, reviewCount INTEGER, stars INTEGER DEFAULT 0)', (err, res) => {
    console.log(err ? err.stack : res);
    // client.end();
});

for (let index = 0; index < 1000000; index++) {
    pool.query('INSERT INTO reviews(reviewCount, stars) VALUES($1, $2)', [genRandomInt(0, 801), genRandomInt(0, 5)], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
        }
    });    
}
