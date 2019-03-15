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

} else {
    // TODO: Auto-increment MongoDB IDs here
    MongoClient.connect('mongodb://localhost:27017/amazon-cart', (err, db) => {
        if (err) throw err;
        console.log('Connected To DB');
        const dbo = db.db('amazon-cart');

        /* create counters collection */ 
        db.counters.insert (
            {
                _id: "reviews",
                seq: NumberInt(0)
            }
        );

        /* increment counter by 1 */ 
        function getNextSequence(name) {
        var ret = db.counters.findAndModify(
            {
                query: { _id: name },
                update: { $inc: { seq: 1 } },
                new: true
            }
        );
        return ret.seq;
        }

        /* add incremental counters to reviews */ 
        // TODO: Find and update only records without id field
        db.reviews.find({}).forEach(function(doc){  
            db.reviews.update({_id:  doc._id}, {$set: {
                id: getNextSequence("reviews")
            }});    
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