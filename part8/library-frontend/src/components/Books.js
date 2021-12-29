import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('All Genres')
  const result = useQuery(ALL_BOOKS)

  if (result.loading) return <div>loading</div>
    
  if (!props.show) {
    return null
  }

  const books = result.data.allBooks
  const genres = books.map(b => b.genres).flat().filter((b, i, a) => a.indexOf(b) === i).concat('All Genres')

  return (
    <div>
      <h2>books</h2>
      in genre <strong>{genre}</strong>
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
              .filter(b => genre === 'All Genres' ? true : b.genres.includes(genre))
              .map(b =>
                <tr key={b.title}>
                  <td>{b.title}</td>
                  <td>{b.author.name}</td>
                  <td>{b.published}</td>
                </tr>
          )}
        </tbody>
      </table>
      {genres.map(g => <button key={g} value={g} onClick={(e) => setGenre(e.target.value)}>{g}</button>)}
    </div>
  )
}

export default Books
