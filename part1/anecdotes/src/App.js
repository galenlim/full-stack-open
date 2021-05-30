import React, { useState } from 'react'

const Header = (props) => (
  <h1>{props.title}</h1>
)

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min
  }

  const updateVotes = () => {
    const copy = [...points]
    copy[selected] += 1
    return copy
  }

  return (
    <div>
      <Header title='Anecodote of the day' />
      {anecdotes[selected]}
      <p>has {points[selected]} votes</p>
      <p>
        <Button text='vote' handleClick={() => setPoints(updateVotes)} />
        <Button text='next anecdote' handleClick={() => setSelected(randomNumber(0, anecdotes.length))} />
      </p>
      <Header title='Anecodote with most votes' />
      {anecdotes[points.indexOf(Math.max(...points))]}
      <p>has {Math.max(...points)} votes</p>
    </div>
  );
}

export default App;