const mongoose = require('mongoose')
const supertest = require('supertest')
//const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

//beforeEach(async () => {
//    await Blog.deleteMany({})
//
//    const blogObjects = helper.initialBlogs
//        .map(blog => new Blog(blog))
//    const promiseArray = blogObjects.map(blog => blog.save())
//    await Promise.all(promiseArray)
//})

test('blog posts are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    mongoose.connection.close()
})
