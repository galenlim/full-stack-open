import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

let component
let div

const blog = {
  user: 'user1',
  likes: 2,
  author: 'author1',
  title: 'title1',
  url: 'url'
}

beforeEach(() => {

  component = render(
    <Blog key={blog.id} blog={blog} deleteBlog={jest.fn()} userid="1" />
  )
  div = component.container.querySelector('.blogDiv')

})

describe('Initial rendering', () => {

  test('Blog renders title', () => {
    expect(div).toHaveTextContent('title1')
  })

  test('Blog renders author', () => {
    expect(div).toHaveTextContent('author1')
  })

  test('Blog does not render url and likes', () => {
    expect(div).not.toHaveTextContent('url')

    expect(div).not.toHaveTextContent(2)
  })
})

describe('When show button is clicked', () => {

  beforeEach(() => {
    const showButton = component.getByDisplayValue('view')
    fireEvent.click(showButton)
  })

  test('url is shown', () => {
    expect(div).toHaveTextContent('url')
  })

  test('number of likes is shown', () => {
    expect(div).toHaveTextContent(2)
  })
})
