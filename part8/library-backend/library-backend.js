require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')

const Book = require('./models/book')
const Author = require('./models/author')

const MONGODB_URI = process.env.MONGODB_URI 

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!,
    author: Author!,
    published: Int!,
    genres: [String!]
    id: ID!
  }

  type Author {
    id: ID!,
    name: String!,
    born: Int,
    bookCount: Int!
  }

  type Query {
    bookCount: Int!,
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!,
      author: String,
      published: Int!,
      genres: [String!]!
    ): Book
    addAuthor(
      name: String!,
      born: Int!
    ): Author
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author
  }
`
const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let results = books
      if (args.author) {
        results = results.filter(book => book.author === args.author)
      } 
      if (args.genre) {
        results = results.filter(book => book.genres.includes(args.genre))
      }
      return results
    },
    allAuthors: () => authors
  },
  Author: {
    bookCount: (root) => 
      books.filter(book => book.author === root.name).length
  },
  Mutation: {
    addBook: (root, args) => {
      const book = new Book({ ...args })
      return book.save()
    },
    addAuthor: (root, args) => {
      const author = new Author({ ...args })
      return author.save()
    },
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
