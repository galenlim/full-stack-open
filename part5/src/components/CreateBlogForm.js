import React from 'react'

const CreateBlogForm = ({ title, author, url, setTitle, setAuthor, setUrl, handleCreate }) => (
    <form onSubmit={handleCreate}>
      title:<input type="text" value={title} onChange={({ target }) => setTitle(target.value)}/><br />
      author:<input type="text" value={author} onChange={({ target }) => setAuthor(target.value)}/><br />
      url:<input type="text" value={url} onChange={({ target }) => setUrl(target.value)}/><br />
      <button type="submit">create</button>
    </form>
)

export default CreateBlogForm
