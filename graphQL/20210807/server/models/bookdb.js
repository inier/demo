const mongoose = require("mongoose");

const DB = function () {
    // connect to mlab database
    var uri = "mongodb+srv://jazz:admin%40123456@cluster0.67nga.mongodb.net/test?retryWrites=true&w=majority";
    var uri = "mongodb://jazz:admin%40123456@cluster0-shard-00-00.67nga.mongodb.net:27017,cluster0-shard-00-01.67nga.mongodb.net:27017,cluster0-shard-00-02.67nga.mongodb.net:27017/test?ssl=true&replicaSet=atlas-143be9-shard-0&authSource=admin&retryWrites=true&w=majority";
    mongoose.connect(uri);  // { useNewUrlParser: true, useUnifiedTopology: true }
    const db = mongoose.connection;

    db.once('open', () => {
        console.log("connected to database");
    });
    db.on('error', (e) => console.log(e));

    return db;
}

module.exports = DB;