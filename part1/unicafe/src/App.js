import React, { useState } from 'react'

const Header = ({title}) => (
  <h1>{title}</h1>
)

const Button = (props) => ( 
  <button onClick={props.handleClick}>{props.text}</button>
 )

const Statistics = (props) => (
  <tr>
    <td>{props.text}</td> 
    <td>{props.value}</td>
  </tr>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + bad + neutral
  const average = all ? (good - bad) / all : 0
  const positive = (all ? good / all * 100 : 0) + ' %'

  if(all) {
    return (
      <div>
        <Header title='give feedback'/>
        <Button text='good' handleClick={() => setGood(good + 1)}/>
        <Button text='neutral' handleClick={() => setNeutral(neutral + 1)}/>
        <Button text='bad' handleClick={() => setBad(bad + 1)}/>
        <Header title='statistics'/>
        <table>
          <tbody>
            <Statistics text='good' value={good} />
            <Statistics text='neutral' value={neutral} />
            <Statistics text='bad' value={bad} />
            <Statistics text='all' value={all} />
            <Statistics text='average' value={average} />
            <Statistics text='positive' value={positive} />
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <div>
      <Header title='give feedback'/>
      <Button text='good' handleClick={() => setGood(good + 1)}/>
      <Button text='neutral' handleClick={() => setNeutral(neutral + 1)}/>
      <Button text='bad' handleClick={() => setBad(bad + 1)}/>
      <Header title='statistics'/>
      No feedback given
    </div>
  )
}

export default App;
