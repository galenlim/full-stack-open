import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setMessage } from '../reducers/messageReducer'

const CreateBlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  const addBlog =  async (event) => {
    event.preventDefault()
    try {
      dispatch(createBlog({ title, author, url }))
      dispatch(setMessage(`a new blog ${title} by ${author} added`, false, 5))
    } catch (error) {
      dispatch(setMessage(error.message, true, 3))
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:<input id="title" type="text" value={title} onChange={({ target }) => setTitle(target.value)}/><br />
        author:<input id="author" type="text" value={author} onChange={({ target }) => setAuthor(target.value)}/><br />
        url:<input id="url" type="text" value={url} onChange={({ target }) => setUrl(target.value)}/><br />
        <button id="create-new-button" type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm
