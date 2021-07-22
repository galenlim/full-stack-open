const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blog posts are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('id property is returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('new posts can be created with the correct content', async () => {
    const newBlog = {
        title: 'React patterns',
        author: 'Michael',
        url: 'https://reactpatterns.com/',
        likes: 7,
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    expect(response.body).toMatchObject(newBlog)
})

test('missing likes property defaults to 0', async () => {
    const newBlogWithoutLikes = {
        title: 'React patterns',
        author: 'Michael',
        url: 'https://reactpatterns.com/',
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlogWithoutLikes)
        .expect(201)

    expect(response.body.likes).toEqual(0)
})

afterAll(() => {
    mongoose.connection.close()
})
