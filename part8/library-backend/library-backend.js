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
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let results = await Book.find({})
      if (args.author) {
        results = results.filter(book => book.author === args.author)
      } 
      if (args.genre) {
        results = results.filter(book => book.genres.includes(args.genre))
      }
      return results
    },
    allAuthors: async () => await Author.find({})
  },
  Author: {
    bookCount: async (root) => 
    await Book.find( { author: { $in: [ root.id ] } } ).countDocuments()
  },
  Book: {
    author: async (root) => await Author.findById(root.author)
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author, born: null })
        await author.save()
      }
      const book = new Book({ ...args, author })
      return book.save()
    },
    addAuthor: (root, args) => {
      const author = new Author({ ...args })
      return author.save()
    },
    editAuthor: async (root, args) => {
      const updatedAuthor = await Author.findOneAndUpdate(
        { name: args.name }, 
        { born: args.setBornTo }, 
        { new: true }
      )
      if (!updatedAuthor) return null

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
