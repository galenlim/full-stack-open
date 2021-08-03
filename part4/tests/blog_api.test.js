const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

describe('when interacting with blogs', () => {
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
        const token = await helper.getToken()

        const response = await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + token)
            .send(newBlog)
            .expect(201)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        expect(response.body).toMatchObject(newBlog)
    })

    test('new posts creation fails with status code 401 if token is not provided', async () => {
        const newBlog = helper.initialBlogs[0]

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('missing likes property defaults to 0', async () => {
        const newBlogWithoutLikes = { ...helper.initialBlogs[0] }
        delete newBlogWithoutLikes.likes
        const token = await helper.getToken()

        const response = await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + token)
            .send(newBlogWithoutLikes)
            .expect(201)

        expect(response.body.likes).toEqual(0)
    })

    test('missing title and url properties return a bad request', async () => {
        const newBlogMissingProps = { ...helper.initialBlogs[0] }
        delete newBlogMissingProps.title
        delete newBlogMissingProps.url
        const token = await helper.getToken()

        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + token)
            .send(newBlogMissingProps)
            .expect(400)
    })

    test('delete resource by id works and returns status code 204', async () => {
        const blogToDelete = helper.initialBlogs[0]
        const token = await helper.getToken()

        const response = await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + token)
            .send(blogToDelete)
            .expect(201)

        const blogsAfterAdd = await helper.blogsInDb()
        expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length + 1)

        await api
            .delete(`/api/blogs/${response.body.id}`)
            .set('Authorization', 'bearer ' + token)
            .expect(204)

        const blogsAfterDelete = await helper.blogsInDb()
        expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length)
    })

    test('update individual blog post correctly', async () => {
        const blogToInsert = helper.initialBlogs[0]
        const token = await helper.getToken()

        const response = await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + token)
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
            .set('Authorization', 'bearer ' + token)
            .send(blogToUpdate)
            .expect(200)

        const blogsAfterUpdate = await helper.blogsInDb()

        expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length + 1)

        const processedBlogToUpdate = JSON.parse(JSON.stringify(blogToUpdate))

        expect(updatedResponse.body).toMatchObject(processedBlogToUpdate)

    })

})


describe('when there is initially one user in db', () => {
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

describe('when logging in', () => {
    test('with correct password, login succeeds with returned token', async () => {
        const newLogin = {
            username: 'root',
            password: 'sekret',
        }

        const result = await api
            .post('/api/login')
            .send(newLogin)
            .expect(200)

        expect(result.body).toHaveProperty('token')
    })

    test('with wrong password, login fails with error message', async () => {
        const newLogin = {
            username: 'root',
            password: 'sekre',
        }

        const result = await api
            .post('/api/login')
            .send(newLogin)
            .expect(401)

        expect(result.body.error).toContain('invalid username or password')
    })
})

afterAll(() => {
    mongoose.connection.close()
})
