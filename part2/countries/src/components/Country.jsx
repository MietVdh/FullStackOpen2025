import Weather from './Weather'

const Country = ({ country }) => {
    return (
        <div>
            <h1>{country.name}</h1>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <h2>Languages</h2>
            <ul>
                {country.languages.map(l => <li key={l}>{l}</li>)}
            </ul>
            <img src={country.flag} alt={country.flagAlt} />
            {country.weather ? 
                <div>
                    <h2>Weather in {country.capital}</h2>
                    <p>Temperature: {country.weather.temp_c} degrees Celsius</p>
                    <p>{country.weather.icon}</p>
                    <p>Wind {country.weather.wind} kph</p>
                </div>
             : <p></p>}
            
            
        </div>
    )
}

export default Country