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

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    
  )
}

const Statistics = ({ good, neutral, bad}) => {
  const total = good + neutral + bad
  const positive = (good / total) * 100
  if (total == 0) {
    return (
    <div>
      <h2>statistics</h2>
      <p>No feedback given</p>
    </div>
    )
  }

  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={(good - bad)/total} />
          <StatisticLine text="positive" value={positive + " %"} />

        </tbody>
      </table>
      
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