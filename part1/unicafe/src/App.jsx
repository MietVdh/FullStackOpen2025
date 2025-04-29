import { useState } from 'react'

const Button = ({ onClick, text}) => {
  return (
  <button onClick={onClick}>
    {text}
  </button>
  )
}

const Feedback = (props) => {
  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={props.handleGood} text='good' />
      <Button onClick={props.handleNeutral} text='neutral' />
      <Button onClick={props.handleBad} text='bad' />
    </div>
  )
}

const Statistics = ({ good, neutral, bad}) => {
  return (
    <div>
      <h2>Statistics</h2>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Feedback 
        handleGood={() => setGood(good + 1)}
        handleNeutral={() => setNeutral(neutral + 1)}
        handleBad={() => setBad(bad + 1)}
      />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App