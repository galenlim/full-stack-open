import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from '../queries'

const Recommendations = (props) => {
  const result = useQuery(ALL_BOOKS)
  const userResult = useQuery(CURRENT_USER)

  if (!props.show) return null
  if (result.loading) return <div>loading</div>
  if (userResult.loading) return <div>loading</div>

  const books = result.data.allBooks
  const favoriteGenre = userResult.data.me.favoriteGenre

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <strong>{favoriteGenre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books
              .filter(b => b.genres.includes(favoriteGenre))
              .map(b =>
                <tr key={b.title}>
                  <td>{b.title}</td>
                  <td>{b.author.name}</td>
                  <td>{b.published}</td>
                </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
