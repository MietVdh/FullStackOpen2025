const Weather = ({ capital, weather }) => (
    <div>
        <h2>Weather in {capital}</h2>
        <p>Temperature: {weather.temp_c} degrees Celsius</p>
        <img src={weather.icon} />
        <p>Wind {weather.wind} kph</p>
    </div>
    
)

export default Weather