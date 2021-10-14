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
})
