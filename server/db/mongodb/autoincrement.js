// const { Product } = require('../../db/mongodb/Product');
// const { Review } = require('../../db/mongodb/Review');

let MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/amazon-cart', (err, db) => {
    if (err) throw err;
    console.log('Connected To DB');
    const dbo = db.db('amazon-cart');
    
    // dbo.collection("reviews").find({productName: 'Generic Frozen Fish'}, function (err, docs) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(docs);
    //     }
    // });
});  

/* create counters collection */ 
db.counters.insert (
    {
        _id: "products",
        // seq: 0
        seq: NumberInt(0)
    }
);

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
db.reviews.find({}).forEach(function(doc){
         
    db.reviews.update({_id:  doc._id}, {$set: {
        id: getNextSequence("reviews")
    }});    
});


/* remove id fields from reviews */ 
db.reviews.find().forEach(function(doc){
    db.reviews.update({_id :  doc._id}, {
       $unset: {id : ""}
    });    
});
 
/* reset counters to zero */ 
db.counters.find().forEach(function(doc){    
    db.counters.update({_id :  doc._id}, {
       // $set : {seq: 0}
       $set : {seq: NumberInt(0)}
    });    
});
