require('dotenv').config()
const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!,
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

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
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) =>
      await Book.find( { author: { $in: [ root.id ] } } ).countDocuments()
  },
  Book: {
    author: async (root) => await Author.findById(root.author)
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author })
      let newAuthor
      if (!author) {
        author = new Author({ name: args.author, born: null })
        try {
          newAuthor = await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args.author
          })
        }
      }
      const book = new Book({ ...args, author })
      try {
        await book.save()
      } catch (error) {
        if (newAuthor) {
          await Author.deleteOne(newAuthor)
        }
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return book
    },
    addAuthor: async (root, args) => {
      const author = new Author({ ...args })
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return author
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const updatedAuthor = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      )
      if (!updatedAuthor) return null

      return updatedAuthor
    },
    createUser: async (root, args) => {
      const user = new User({ username:args.username, favoriteGenre:args.favoriteGenre })

      try {
        await user.save()
        return user
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

const context = async ({ req }) => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), JWT_SECRET
    )
    const currentUser = await User.findById(decodedToken.id)
    return { currentUser }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
