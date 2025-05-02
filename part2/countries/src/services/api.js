import axios from 'axios'

const countriesBaseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAllCountries = () => axios.get(`${countriesBaseUrl}/all`)

const getCountry = countryName => axios.get(`${countriesBaseUrl}/name/${countryName}`)

const getWeatherInfo = (capitalName) => {
  return axios.get(`https://weatherapi-com.p.rapidapi.com/current.json?q=${capitalName}`,
  { 'headers': 
    { 'x-rapidapi-key': import.meta.env.VITE_RAPID_KEY,
      'x-rapidapi-host': import.meta.env.VITE_RAPID_HOST
    }
  })
}

export { getAllCountries, getCountry, getWeatherInfo }