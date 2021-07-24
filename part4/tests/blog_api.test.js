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
    const newBlog = helper.initialBlogs[0]

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    expect(response.body).toMatchObject(newBlog)
})

test('missing likes property defaults to 0', async () => {
    const newBlogWithoutLikes = { ...helper.initialBlogs[0] }
    delete newBlogWithoutLikes.likes

    const response = await api
        .post('/api/blogs')
        .send(newBlogWithoutLikes)
        .expect(201)

    expect(response.body.likes).toEqual(0)
})

test('missing title and url properties return a bad request', async () => {
    const newBlogMissingProps = { ...helper.initialBlogs[0] }
    delete newBlogMissingProps.title
    delete newBlogMissingProps.url

    await api
        .post('/api/blogs')
        .send(newBlogMissingProps)
        .expect(400)
})

test('delete resource by id works and returns status code 204', async () => {
    const blogToDelete = helper.initialBlogs[0]

    const response = await api
        .post('/api/blogs')
        .send(blogToDelete)
        .expect(201)

    const blogsAfterAdd = await helper.blogsInDb()
    expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length + 1)

    await api
        .delete(`/api/blogs/${response.body.id}`)
        .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length)
})

test('update individual blog post correctly', async () => {
    const blogToInsert = helper.initialBlogs[0]

    const response = await api
        .post('/api/blogs')
        .send(blogToInsert)
        .expect(201)

    const blogsAfterAdd = await helper.blogsInDb()
    expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length + 1)

    const blogToUpdate = {
        id: response.body.id,
        title: 'Test patterns',
        author: 'Gabriel',
        url: 'https://reactpatterns.com/',
        likes: 5,
    }
    const updatedResponse = await api
        .put(`/api/blogs/${response.body.id}`)
        .send(blogToUpdate)
        .expect(200)

    const blogsAfterUpdate = await helper.blogsInDb()

    expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length + 1)

    const processedBlogToUpdate = JSON.parse(JSON.stringify(blogToUpdate))

    expect(updatedResponse.body).toEqual(processedBlogToUpdate)

})

afterAll(() => {
    mongoose.connection.close()
})
