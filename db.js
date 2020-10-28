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
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.find(query).count((err, docs) => {
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
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.find(query).toArray((err, docs) => {
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
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                const myquery = { issueNumber: "BOOK-2" };
                const values = { $set: { status: "OPEN AS HELL" } };
                collection.updateOne(query, newValues, (err, docs) => {
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
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.insertOne(item, (err, result) => {
                    resolve(result);
                });
            });
        });
    };
    //Performs the join between tables from a given pipeline
    const aggregate = (collectionName, pipeline = []) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                const db = client.db(DB_NAME);
                const collection = db.collection(collectionName);
                collection.aggregate(pipeline).toArray((err, docs) => {
                    if (err) {
                        console.log(" --- aggregate ERROR ---");
                        console.log(err);
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