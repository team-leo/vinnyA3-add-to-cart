const { Pool, Client } = require('pg');
const pgp = require('pg-promise')({capSQL: true});
const cluster = require('cluster');
const path = require('path');
const now = require('performance-now');
const config = require(path.join(__dirname, '../../../server/config/postgres/config'));
const genRandomInt = require(path.join(__dirname, '../../../server/utils/genRandInt'));


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

//   db.query('CREATE TABLE reviews(id SERIAL PRIMARY KEY, reviewCount INTEGER, stars INTEGER DEFAULT 0)', (err, res) => {
//     console.log(err ? err.stack : res);
//     console.log(`${now()}ms`);
//   });
  
  let cs = new pgp.helpers.ColumnSet([
    {name: 'reviewcount', def: 0},
    {name: 'stars', def: 0}
  ], {table: 'reviews'});

  let startTime = now();
  let data = [];
  
  for (let index = 0; index < 10; index++) {
    data.push({reviewcount: genRandomInt(0, 801), stars: genRandomInt(0, 5)});
  }
  
  db.task('inserting-reviews', t => {
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
