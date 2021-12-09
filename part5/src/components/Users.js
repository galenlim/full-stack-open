import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core'

const Users = () => {
  const blogs = useSelector(state => state.blogs)
  const users = []
  const usersMap = new Map()
  blogs.forEach(blog => {
    if (!usersMap.has(blog.user.id)) {
      usersMap.set(blog.user.id, true)
      users.push({
        id: blog.user.id,
        name: blog.user.name
      })
    }
  })

  return (
    <div>
      <h2>Users</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Blogs Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user =>
              <TableRow key={user.id}>
                <TableCell><Link to={`/users/${user.id}`}>{user.name}</Link></TableCell>
                <TableCell>{blogs.filter(blog => blog.user.id === user.id).length}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
