const express = require("express");
const assert = require("assert");

const router = express.Router();

const MongoClient = require("mongodb").MongoClient;

const mongodb = require("mongodb");

//Connection URL
const url = "mongodb://localhost:27017";

//Database and collection creation
//Important: In MongoDB, a collection is not created until it gets content!
//Important: In MongoDB, a database is not created until it gets content!
//MongoDB waits until you have inserted a document before it actually creates the collection.

MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  var dbo = db.db("ads");
  dbo.createCollection("ads", (err, res) => {
    assert.equal(null, err);
    //console.log(" ADS Collection created!");
    db.close();
  });
});

// Router Endpoints

router.get("/", async (req, res) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    var dbo = db.db("ads");
    dbo
      .collection("ads")
      .find({})
      .toArray((err, result) => {
        res.status(200).send(result);
        assert.equal(err, null);
      });
    db.close();
  });
});

router.post("/", (req, res) => {
  const newAd = { title: req.body };
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    var dbo = db.db("ads");
    dbo.collection("ads").insertOne(newAd, (err, res) => {
      assert.equal(null, err);
    });
    db.close();
  });
  res.status(200).send("1 Document inserted");
});

// endpoint to delete an ad
router.delete("/:id", (req, res) => {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log(req.params.id);
    var dbo = db.db("ads");
    dbo
      .collection("ads")
      .deleteOne({ _id: mongodb.ObjectId(req.params.id) }, (err, obj) => {
        assert.equal(err, null);
        console.log("1 document deleted");
        console.log();
        db.close();
      });
  });
  res.status(200).send();
});

// endpoint to update an ad
router.put("/:id", (req, res) => {
  const updatedAd = req.body;

  MongoClient.connect(url, (err, db) => {
    assert.equal(err, null);
    var dbo = db.db("ads");
    var newvalues = { $set: { title: req.body.title } };
    dbo
      .collection("ads")
      .updateOne(
        { _id: mongodb.ObjectId(req.params.id) },
        newvalues,
        (err, res) => {
          assert.equal(null, err);
          console.log("1 document updated");
          db.close();
        }
      );
  });
  res.status(200).send("1 document updated");
});

module.exports = router;
