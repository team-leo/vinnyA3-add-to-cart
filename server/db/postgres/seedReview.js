const { Pool, Client } = require('pg');
const pgp = require('pg-promise')({capSQL: true});
const path = require('path');
const now = require('performance-now');
const config = require(path.join(__dirname, '../../../server/config/postgres/config'));
const genRandomInt = require(path.join(__dirname, '../../../server/utils/genRandInt'));

// let pool = new Pool(config);
const db = pgp(config);

const cs = new pgp.helpers.ColumnSet([
    {name: 'reviewcount', def: 0},
    {name: 'stars', def: 0}
], {table: 'reviews'});


let startTime = now();
let data = [];

for (let index = 0; index < 10000000; index++) {
    data.push({reviewcount: genRandomInt(0, 801), stars: genRandomInt(0, 5)});
}

db.task('inserting-reviews', t => {
    const insert = pgp.helpers.insert(data, cs);
    return t.none(insert);
})
.then(() => {
    console.log(`Success: Database seeding took ${now() - startTime}ms`);
})
.catch(error => {
    console.log(error);
    console.log(`Operation time: ${now() - startTime}ms`);
});
