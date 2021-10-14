describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Tester',
      username: 'tester',
      password: 'tested'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function() {
    cy.get('#loginform')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input[name="Username"]').type('tester')
      cy.get('input[name="Password"]').type('tested')
      cy.get('button').contains('login').click()

      cy.get('#logged-in-message').should('contain', 'Tester logged in')
    })

    it('fils with wrong credentials', function() {
      cy.get('input[name="Username"]').type('tester')
      cy.get('input[name="Password"]').type('wrong')
      cy.get('button').contains('login').click()

      cy.get('.error').should('contain', 'wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'tester', password: 'tested'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test Url')
      cy.get('#create-new-button').click()

      cy.get('.blogDiv').should('contain', 'Test Title')
      cy.get('.blogDiv').should('contain', 'Test Author')
    })

    describe('and when a post is present', function() {
      beforeEach(function() {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3003/api/blogs',
          body: { title: 'Test Title', author: 'Test Author', url: 'Test Url' },
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
          }
        })

        cy.visit('http://localhost:3000')
        cy.contains('Test Title').find('input[value="view"]').click()
      })

      it('it can be liked', function() {
        cy.contains('Test Title').find('input[value="like"]').click()

        cy.contains('Test Title').should('contain', 'likes 1')
      })

      it('it can be deleted by the user who created it', function() {
        cy.contains('Test Title').find('input[value="remove"]').click()

        cy.should('not.contain', 'Test Title')
      })

      it.only('it cannot be deleted by other users', function() {
        cy.get('input[value="logout"]').click()

        const user = {
          name: 'Tester 2',
          username: 'tester2',
          password: 'tested'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)

        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'tester2', password: 'tested'
        }).then(response => {
          localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })

        cy.contains('Test Title').find('input[value="view"]').click()
        cy.contains('Test Title').find('input[value="remove"]').should('not.exist')
      })
    })
  })
})
