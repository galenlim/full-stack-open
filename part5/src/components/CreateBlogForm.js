import React, { useState } from 'react'

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      title:<input id="title" type="text" value={title} onChange={({ target }) => setTitle(target.value)}/><br />
      author:<input id="author" type="text" value={author} onChange={({ target }) => setAuthor(target.value)}/><br />
      url:<input id="url" type="text" value={url} onChange={({ target }) => setUrl(target.value)}/><br />
      <button id="create-new-button" type="submit">create</button>
    </form>
  )
}

export default CreateBlogForm
