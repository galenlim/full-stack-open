import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

let component

beforeEach(() => {
  const blog = {
    user: 'user1',
    likes: 2,
    author: 'author1',
    title: 'title1',
    url: 'url'
  }

  component = render(
    <Blog key={blog.id} blog={blog} deleteBlog={jest.fn()} userid="1" />
  )

})

test('Blog renders title', () => {
  expect(
    component.container.querySelector('.blogDiv')
  ).toHaveTextContent('title1')
})

test('Blog renders author', () => {
  expect(
    component.container.querySelector('.blogDiv')
  ).toHaveTextContent('author1')
})

test('Blog does not render url and likes', () => {
  expect(
    component.container.querySelector('.blogDiv')
  ).not.toHaveTextContent('url')

  expect(
    component.container.querySelector('.blogDiv')
  ).not.toHaveTextContent(2)
})
