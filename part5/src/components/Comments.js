import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { commentBlog } from '../reducers/blogReducer'
import PropTypes from 'prop-types'
import {
  Button,
  TextField,
} from '@material-ui/core'

const Comments = ({ comments, id }) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()

  const addComment =  async (event) => {
    event.preventDefault()
    try {
      const newComments = comments.concat(comment)
      dispatch(commentBlog({ newComments, id }))
      //dispatch(setMessage(`a new blog ${title} by ${author} added`, false, 5))
    } catch (error) {
      //
    }

    setComment('')
  }

  return (
    <div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <TextField label="comment" id="title" type="text" value={comment} onChange={({ target }) => setComment(target.value)}/>
        <Button variant="contained" color="primary" id="create-new-button" type="submit">add comment</Button>
      </form>
      <ul>
        {comments
          .map((comment, index) =>
            <li key={index}>{comment}</li>
          )}
      </ul>
    </div>
  )
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
}

export default Comments
