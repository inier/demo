const express = require('express');
// 1. npm install express-graphql graphql --save
// 2. 引入express-graphql
const { graphqlHTTP } = require('express-graphql');
// 3. 引入自定义的schema
const GraphQLBooksSchema = require('./schema/book.js');
const GraphQLArticlesSchema = require('./schema/article.js');
const DB = require('./models/bookdb');
const cors = require('cors');
const app = express();

//allow cross-origin request
app.use(cors());

// database
DB();

// query books 
app.use('/graphql/books', graphqlHTTP((req) => {
    return {
        schema: GraphQLBooksSchema, // graphql schema
        graphiql: true // 是否开启可视化工具
    }
}));

// query articles 
app.use('/graphql/articles', graphqlHTTP((req) => {
    return {
        schema: GraphQLArticlesSchema, // graphql schema
        graphiql: true // 是否开启可视化工具
    }
}));

app.listen(4000, () => {
    console.log('listening on port:4000');
});