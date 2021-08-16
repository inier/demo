const DB = require("../models/db.js");
// 从graphql中获取所需要的子模块
const {
    // schema类型
    GraphQLObjectType,
    // 字段的类型
    GraphQLString,
    GraphQLInt,

    GraphQLSchema,
    // 数组类型
    GraphQLList,
} = require("graphql");

//1.获取导航列表，定义导航的schema类型
var NavSchema = new GraphQLObjectType({
    // 取个名字
    name: "nav",
    // 字段，与数据库对应
    fields: {
        _id: {
            type: GraphQLString,
        },
        title: {
            type: GraphQLString,
        },
        url: {
            type: GraphQLString,
        },
        sort: {
            type: GraphQLInt,
        },
        status: {
            type: GraphQLInt,
        },
        add_time: {
            type: GraphQLString,
        },
    },
});
var ArticleCateSchema = new GraphQLObjectType({
    name: "articleCate",
    fields: {
        _id: {
            type: GraphQLString,
        },
        title: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        keywords: {
            type: GraphQLString,
        },
        status: {
            type: GraphQLInt,
        },
    },
});
// 2.定义一个根 ,根里面定义调用导航schema类型的方法
var RootSchema = new GraphQLObjectType({
    name: "root",
    fields: {
        // 方法名称：定义调用导航schema类型的方法
        oneNavList: {
            // 方法的类型, 方法返回的参数必须和NavSchema里面定义的类型一致
            type: NavSchema,
            // 参数
            args: {
                id: { type: GraphQLString },
            },
            // 执行的操作
            async resolve(parent, args) {
                // 获取调用方法传入的值 args.id
                var id = args.id;
                var navList = await DB.find("nav", { _id: DB.getObjectId(id) });
                // 由于NavSchema的类型为一个对象，所以返回写成navList[0]的形式
                return navList[0];
            },
        },
        // 查询所有的Nav
        navList: {
            // 让返回类型为列表类型
            type: GraphQLList(NavSchema),
            async resolve(parent, args) {
                var navList = await DB.find("nav", {});
                return navList;
            },
        },
        // 查询文章分类列表
        articleCateList: {
            type: GraphQLList(ArticleCateSchema),
            async resolve(parent, args) {
                var articlecateList = await DB.find("articleCate", {});
                return articlecateList;
            },
        },
        // 查询一个文章分类下的文章
        oneArticleCateList: {
            type: ArticleCateSchema,
            args: { id: { type: GraphQLString } },
            async resolve(parent, args) {
                var id = args.id;
                var articlecateList = await DB.find("articleCate", {
                    _id: DB.getObjectId(id),
                });
                // 要返回一个JSON对象
                return articlecateList[0];
            },
        },
    },
});

//3.把根挂载到 GraphQLSchema
module.exports = new GraphQLSchema({
    query: RootSchema,
});
