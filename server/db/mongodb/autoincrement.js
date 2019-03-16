const cluster = require('cluster');
let MongoClient = require('mongodb').MongoClient;


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

  MongoClient.connect('mongodb://localhost:27017/amazon-cart', { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        console.log('Connected To DB');
        const dbo = db.db('amazon-cart');

        /* create counters collection */ 
        dbo.createCollection('counters', (err, res) => {
            if (err) throw err;
            console.log(`'counters' collection created`);

            dbo.collection('counters').insertOne(
                {
                    _id: "reviews",
                    seq: 0
                }
            );            
            db.close();
        });
  });

} else {
    MongoClient.connect('mongodb://localhost:27017/amazon-cart', { useNewUrlParser: true }, async (err, db) => {
        if (err) throw err;
        console.log('Connected To DB');
        const dbo = db.db('amazon-cart');

        /* increment counter by 1 */ 
        async function getNextSequence(name) {
            let count = 100;
            await dbo.collection('counters').findOneAndUpdate(
                {_id: name},
                {$inc: {seq: 1}}
            ).then(res => {
                // console.log('val return from db', res.value.seq);
                count = res.value.seq;
                // console.log('count', count);
            }).catch(err => {
                console.log(err);
            });
            // console.log('count', count);
            return count;
        }

        /* add incremental counters to reviews */ 
        // Limit search to range of numbers (ex. 1-10,000)
        dbo.collection('reviews')
           .find({id: {$not: {$gte: 0}}})
           .limit(5)
           .forEach(await function(doc){
                let currentId = getNextSequence("reviews").then((res) => {
                    // console.log('res from async', res); 
                    currentId = res;
                    // console.log('mycurrentid', currentId);
                    // return res;
                    dbo.collection('reviews')
                    .updateOne(
                        {_id: doc._id},
                        {$set: {id: currentId}}
                        );
                    console.log('currentId', currentId);
                    
                });
            
            // console.log('currentId', currentId);
            
            // dbo.collection('reviews')
            //    .updateOne(
            //        {_id: doc._id},
            //        {$set: {id: currentId}}
            //     );
            // console.log('doc', doc);
        });
    });
}


// db.counters.insert (
//     {
//         _id: "products",
//         // seq: 0
//         seq: NumberInt(0)
//     }
// );

/* remove id fields from reviews 
db.reviews.find().forEach(function(doc){
    db.reviews.update({_id :  doc._id}, {
       $unset: {id : ""}
    });    
});
 */ 
/* reset counters to zero  
db.counters.find().forEach(function(doc){    
    db.counters.update({_id :  doc._id}, {
       // $set : {seq: 0}
       $set : {seq: NumberInt(0)}
    });    
});
*/