import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core'
import BookIcon from '@mui/icons-material/Book'

const User = () => {
  const id = useParams().id
  const blogs = useSelector(state => state.blogs)
  if (blogs.length === 0) return null

  const name = blogs.find(blog => blog.user.id === id).user.name

  return (
    <div>
      <h2>{name}</h2>
      <h3>added blogs</h3>
      <List>
        {blogs
          .filter(blog => blog.user.id === id)
          .map(blog =>
            <ListItem key={blog.id}>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary={blog.title} />
            </ListItem>
          )}
      </List>
    </div>
  )
}

export default User
