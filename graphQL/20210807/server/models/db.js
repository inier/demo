var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;
var uri = "mongodb://jazz:admin%40123456@cluster0-shard-00-00.67nga.mongodb.net:27017,cluster0-shard-00-01.67nga.mongodb.net:27017,cluster0-shard-00-02.67nga.mongodb.net:27017/test?ssl=true&replicaSet=atlas-143be9-shard-0&authSource=admin&retryWrites=true&w=majority";
var localUri = 'mongodb://localhost:27017/';
var Config = {
    dbUrl: uri,
    dbName: "test"
};

class DB {
    static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }

    constructor() {
        this.dbClient = '';
        this.connect();
    }
    // 连接数据库
    connect() {
        let that = this;
        return new Promise((resolve, reject) => {
            if (!that.dbClient) {
                MongoClient.connect(Config.dbUrl, (err, client) => {
                    if (err) {
                        reject(err)
                    } else {
                        console.log("connected to database");
                        that.dbClient = client.db(Config.dbName);
                        const collection = client.db(Config.dbName).collection("devices");
                        resolve(that.dbClient)
                    }
                })
            } else {
                resolve(that.dbClient);
            }
        })
    }
    // 查找方法
    find(collectionName, json1, json2, json3) {
        if (arguments.length == 2) {
            var attr = {};
            var slipNum = 0;
            var pageSize = 0;

        } else if (arguments.length == 3) {
            var attr = json2;
            var slipNum = 0;
            var pageSize = 0;
        } else if (arguments.length == 4) {
            var attr = json2;
            var page = json3.page || 1;
            var pageSize = json3.pageSize || 20;
            var slipNum = (page - 1) * pageSize;

            if (json3.sortJson) {
                var sortJson = json3.sortJson;
            } else {
                var sortJson = {}
            }
        } else {
            console.log('传入参数错误')
        }
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                var result = db.collection(collectionName).find(json1, { fields: attr }).skip(slipNum).limit(pageSize).sort(sortJson);
                result.toArray(function (err, docs) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })

            })
        })
    }
    // 更新方法
    update(collectionName, json1, json2) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).updateOne(json1, {
                    $set: json2
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })

            })
        })
    }
    // 插入方法
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertOne(json, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    // 删除方法
    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).removeOne(json, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    // MongoDB按ID的查询方法
    getObjectId(id) {
        return new ObjectID(id);
    }
    // 统计数量的方法
    count(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                var result = db.collection(collectionName).count(json);
                result.then(function (count) {
                    resolve(count);
                })
            })
        })
    }
}
module.exports = DB.getInstance();