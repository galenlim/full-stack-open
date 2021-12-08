import React from 'react'
import { useSelector } from 'react-redux'
import Blog from './Blog'
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <TableRow key={blog.id}>
                <TableCell>
                  <Blog key={blog.id} blog={blog} />
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BlogList
