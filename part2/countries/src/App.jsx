import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'

const App = () => {

const [filter, setFilter] = useState('')
const [countries, setCountries] = useState([])
const [country, setCountry] = useState(null)

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const findAll = () => axios.get(`${baseUrl}/all`)
const findCountry = name => axios.get(`${baseUrl}/name/${name}`)

useEffect(() => {
  if (filter) {
    const containsFilter = (name) => {
      name.toLowerCase().includes(filter.toLowerCase())
    }

    findAll().then(response => {
      setCountries(response.data
        .filter(o => o.name.common.toLowerCase().includes(filter.toLowerCase()))
        .map(o => o.name.common)
      )
      countries.forEach((c) => {console.log(c)})
    })
  }
}, [filter])

useEffect(() => {
  if (countries.length === 1) {
    findCountry(countries[0])
    .then((response) => {
      console.log(response)
      setCountry(response.data)
      console.log(country)
  })}
}, [countries])

const onFilterChange = (event) => {
  console.log(event.target.value)
  setFilter(event.target.value)
}

const handleCountrySelect = country => {
  setCountries([country])
}

if (country) {
  return (
  <Country country={country} />
)}

return (
  <div>
    find countries: <input onChange={onFilterChange} value={filter}/>
    {countries.length > 10 
      ? <p>Too many matches, specify another filter</p>
      : <ul>
          {countries.map(c => <li key={c}>{c} <button onClick={() => handleCountrySelect(c)}>Show</button></li>)}
        </ul>
    }
  </div>
)

}



export default App
