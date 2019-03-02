const path = require('path');
const now = require('performance-now');
 
let makeReview = function () {
  let newReview = {
    reviewCount: 0,
    stars: 0
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

  for (let records = 0; records < 1000000; records++) {
    documents.push(makeReview());  
  }

  dbo.collection("reviews").insertMany(documents, function (err, docs) {
      if (err) throw err;
      console.log(docs.result);
      
      console.log(`Database seeding took ${now() - startTime01}ms`);
      console.log(`${docs.length} documents saved to database`);
      // console.log(process.memoryUsage());
      db.close();
  });

});
