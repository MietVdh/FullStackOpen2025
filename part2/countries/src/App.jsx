import { useState, useEffect } from 'react'
import Country from './components/Country'
import Search from './components/Search'
import Weather from './components/Weather'
import { getAllCountries, getCountry, getWeatherInfo } from './services/api'

const App = () => {

const [filter, setFilter] = useState('')
const [countries, setCountries] = useState([])
const [matchingCountries, setMatchingCountries] = useState([])
const [country, setCountry] = useState(null)
const [weather, setWeather] = useState(null)

// Get all countries when app first loads
useEffect(() => {
  getAllCountries().then(response => {
    setCountries(response.data.map(o => o.name.common))
  })
}, [])


// Update list of countries that match filter
useEffect(() => {
  setMatchingCountries(countries.filter(c => c.toLowerCase().includes(filter.toLowerCase())))
}, [filter])
  
// Update country when one is selected
useEffect(() => {
  if (matchingCountries.length === 1) {
    getCountry(matchingCountries[0])
    .then((response) => {
      const countryObject = {
        name: response.data.name.common,
        capital: response.data.capital[0],
        area: response.data.area,
        languages: Object.values(response.data.languages),
        flag: response.data.flags.png,
        flagAlt: response.data.flags.alt
      }
      setCountry(countryObject)
    })
} else {
  setCountry(null)
}
}, [matchingCountries])

// Update weather
useEffect(() => {
  if (country) {
    getWeatherInfo(country.capital)
    .then((response) => {
      const weatherObj = {
        temp_c: response.data.current.temp_c,
        icon: response.data.current.condition.icon,
        wind: response.data.current.wind_kph
      }
      setWeather(weatherObj)
    })
  } else {
    setWeather(null)
  }
}, [country])


const onFilterChange = (event) => {
  setFilter(event.target.value)
}

const handleCountrySelect = country => {
  setMatchingCountries([country])
}

if (country) {
  return (
    <div>
      <Search onFilterChange={onFilterChange} filter={filter} />
      <Country country={country} />
      {weather ? <Weather capital={country.capital} weather={weather}/> : <p>No weather yet</p>}
    </div>
  
)}

return (
  <div>
    <Search onFilterChange={onFilterChange} filter={filter} />
    {matchingCountries.length > 10 
      ? <p>Too many matches, specify another filter</p>
      : <ul>
          {matchingCountries.map(c => <li key={c}>{c} <button onClick={() => handleCountrySelect(c)}>Show</button></li>)}
        </ul>
    }
  </div>
  )
}

export default App
