import React from 'react'
import { useSelector } from 'react-redux'

const Users = () => {
  const blogs = useSelector(state => state.blogs)
  const users = [...new Set(blogs.map(blog => blog.user.name))]

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(user =>
              <tr key={user}>
                <td>{user}</td>
                <td>{blogs.filter(blog => blog.user.name === user).length}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default Users
