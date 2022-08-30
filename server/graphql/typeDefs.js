const { gql } = require('apollo-server-express');


const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: String
        savedBooks: [Book]
    }

    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User 
    }

    input BookInput {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    type Query {
        me: User
    }

    type Mutation {
        login(username: String!, password: String!): Auth     
        addUser(username: String!, email: String!, password: String!): Auth
        savedBook(book: BookInput!): Boolean
        removeBook(bookId: ID!): Boolean
    }
`

module.exports = typeDefs;