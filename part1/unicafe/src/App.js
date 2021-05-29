import React, { useState } from 'react'

const Header = ({title}) => (
  <h1>{title}</h1>
)

const Button = (props) => ( 
  <button onClick={props.handleClick}>{props.text}</button>
 )

const Display = (props) => (
  <div>{props.label} {props.frequency}</div>
)

const Statistics = (props) => (
  <div>
    <Display label='all' frequency={props.all} />
    <Display label='average' frequency={props.average} />
    <Display label='positive' frequency={props.positive} />
  </div>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + bad + neutral
  const average = all ? (good - bad) / all : 0
  const positive = (all ? good / all * 100 : 0) + ' %'

  return (
    <div>
      <Header title='give feedback'/>
      <Button text='good' handleClick={() => setGood(good + 1)}/>
      <Button text='neutral' handleClick={() => setNeutral(neutral + 1)}/>
      <Button text='bad' handleClick={() => setBad(bad + 1)}/>
      <Header title='statistics'/>
      <Display label='good' frequency={good} />
      <Display label='neutral' frequency={neutral} />
      <Display label='bad' frequency={bad} />
      <Statistics all={all} average={average} positive={positive} />
    </div>
  )
}

export default App;