const cluster = require('cluster');
const path = require('path');
const now = require('performance-now');
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
  let makeReview = function () {
    let newReview = {
      reviewCount: genRandomInt(0, 801),
      // reviewCount: 0,
      stars: genRandomInt(0, 5)
      // stars: 0
    }
    return newReview;
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
      documents.push(makeReview());  
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
