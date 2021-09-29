import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateBlogForm from './CreateBlogForm'

describe('When create new blog form is submitted', () => {

  test('Handler is called with correct details', () => {
    const createBlog = jest.fn()

    const component = render(
      <CreateBlogForm createBlog={createBlog} />
    )

    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(titleInput, {
      target: { value: 'great title' }
    })
    fireEvent.change(authorInput, {
      target: { value: 'great author' }
    })
    fireEvent.change(urlInput, {
      target: { value: 'great url' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)

    expect(createBlog.mock.calls[0][0]['title']).toBe('great title')
    expect(createBlog.mock.calls[0][0]['author']).toBe('great author')
    expect(createBlog.mock.calls[0][0]['url']).toBe('great url')
  })

})
