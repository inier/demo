import { gql } from "apollo-boost";

// books query
export const getBooksQuery = gql`
    {
        books{
            name
            genre
            id
        }
    }
`;

// author query
export const getAuthorsQuery = gql`
    {
        authors{
            name
            id
        }
    }
`;

// book query
export const getBookQuery = gql`
    query($id:ID){
        book(id:$id){
            name
            genre
            id
            author{
                id
                name
                age
                books{
                    name
                    id
                    genre
                }
            }
        }
    }
`;


export const addBookMutation = gql`
    mutation($name:String!,$genre:String!,$authorId:ID!){
        addBook(name: $name, genre: $genre, authorId: $authorId){
            name
            genre
        }
    }
`;

export const delBookMutation = gql`
    mutation($id:ID!){
        delBook(id: $id){
            name
            genre
        }
    }
`;