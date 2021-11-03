Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3003/api/blogs',
    body: { title, author, url },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })
})

Cypress.Commands.add('likeBlog', ({ title, number }) => {
  cy.contains(title).find('input[value="view"]').click()
  for (let i = 0; i < number; i++) {
    cy.contains(title).find('input[value="like"]').click()
    cy.contains(title).should('contain', `likes ${i+1}`)
  }
})
