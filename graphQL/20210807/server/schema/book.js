const {
    // schema类型
    GraphQLObjectType,
    GraphQLSchema,
    // 字段的类型
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    // 数组类型
    GraphQLList,
    GraphQLNonNull,
} = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

// mock
// var books = [
//     { name: "Java", genre: "AAA", id: "1", authorId: '1' },
//     { name: "JavaScript", genre: "BBB", id: "2", authorId: '2' },
//     { name: "React", genre: "CCC", id: "3", authorId: '3' },
//     { name: "Vue", genre: "AAA", id: "4", authorId: '2' },
//     { name: "Sevlte", genre: "BBB", id: "5", authorId: '2' },
//     { name: "jQuery", genre: "CCC", id: "6", authorId: '3' },
// ];
// var authors = [
//     { name: "Zheng", age: 23, id: "1" },
//     { name: "Wang", age: 33, id: "2" },
//     { name: "Kong", age: 43, id: "3" },
// ];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(authors, { id: parent.authorId })
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, { authorId: parent.id })
                return Book.find({ authorId: parent.id });
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                // code to get data from db / other source
                console.log("book: ", typeof args.id);
                // return _.find(books, { id: args.id });
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                // code to get data from db / other source
                console.log("author: ", typeof args.id);
                // return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors;
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                const { name, age } = args;
                let author = new Author({
                    name,
                    age,
                });

                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const { name, genre, authorId } = args;
                if (name && genre && authorId) {
                    let book = new Book({
                        name, genre, authorId
                    });

                    return book.save();
                }

                return null;
            }
        },
        delBook: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Book.deleteOne({ _id: args.id });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});