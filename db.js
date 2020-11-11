const uri = process.env.MONGO_URI;
const MongoClient = require('mongodb').MongoClient;
const DB_NAME = "bug-tracker";
const MONGO_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

module.exports = () => {
    //Function to count the amount of documents from a given table.
    //it accepts a parameter as a query if informed.
    const count = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err)
                    return reject("=-=-==-=-= count::MongoClient.connect =-=-==-=-=")
                        //return reject("=== get::MongoClient.connect")
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.find(query).count((err, docs) => {
                    if (err) {
                        console.log(err)
                        return reject("=-=-==-=-= count::Collection.find =-=-==-=-=")
                            //return reject("=== get::MongoClient.connect")
                    }
                    resolve(docs);
                    client.close();
                });
            });
        });
    };
    //Function to get documents from a given table.
    //it accepts a parameter as a query if informed.
    const get = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    console.log(err)
                    return reject("=-=-==-=-= get::MongoClient.connect =-=-==-=-=")
                        //return reject("=== get::MongoClient.connect")
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.find(query).toArray((err, docs) => {
                    if (err) {
                        console.log(err)
                        return reject("=-=-==-=-= get::Collection.find =-=-==-=-=")
                            //return reject("=== get::MongoClient.connect")
                    }
                    resolve(docs);
                    client.close();

                });
            });
        });
    };
    //Function to update documents from a given table.
    //it accepts a parameter as a query if informed.
    const upd = (collectionName, query = {}, newValues) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    console.log(err)
                    return reject("=-=-==-=-= upd::MongoClient.connect =-=-==-=-=")
                        //return reject("=== get::MongoClient.connect")
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                const myquery = { issueNumber: "BOOK-2" };
                const values = { $set: { status: "OPEN AS HELL" } };
                collection.updateOne(query, newValues, (err, docs) => {
                    if (err) {
                        console.log(err)
                        return reject("=-=-==-=-= upd::Collection.updateOne =-=-==-=-=")
                            //return reject("=== get::MongoClient.connect")
                    }
                    resolve(docs);
                    client.close();

                });
            });
        });
    };
    //Function to add documents to a given table.
    const add = (collectionName, item) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    console.log(err)
                    return reject("=-=-==-=-= add::MongoClient.connect =-=-==-=-=")
                        //return reject("=== get::MongoClient.connect")
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.insertOne(item, (err, result) => {
                    if (err) {
                        console.log(err)
                        return reject("=-=-==-=-= add::Collection.insertOne =-=-==-=-=")
                            //return reject("=== get::MongoClient.connect")
                    }
                    resolve(result);
                });
            });
        });
    };
    //Performs the join between tables from a given pipeline
    const aggregate = (collectionName, pipeline = []) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err)
                    return reject("=-=-==-=-= aggregate::MongoClient.connect =-=-==-=-=")
                        //return reject("=== get::MongoClient.connect")
                }
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.aggregate(pipeline).toArray((err, docs) => {
                    if (err) {
                        console.log(err)
                        return reject("=-=-==-=-= aggregate::Collection.aggregate =-=-==-=-=")
                            //return reject("=== get::MongoClient.connect")
                    }
                    resolve(docs);
                    client.close();
                });
            });
        });
    };
    return {
        get,
        add,
        aggregate,
        count,
        upd
    };
};