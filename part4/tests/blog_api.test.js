const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')
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

describe('when there is initially one user in db', () => {
    beforeEach (async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mlu',
            name: 'Matti',
            password: 'saluton',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'saluton',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Superuser',
            password: 'saluton',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username and password are required')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mlu',
            name: 'Superuser',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username and password are required')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is not at least 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ml',
            name: 'Superuser',
            password: 'saluton',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is not at least 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mlu',
            name: 'Superuser',
            password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})
afterAll(() => {
    mongoose.connection.close()
})
