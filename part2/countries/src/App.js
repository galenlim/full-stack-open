import { useState, useEffect } from 'react'
import axios from 'axios'

const SearchForm = (props) => {

  return (
    <div>find countries <input type='text' onChange={props.handler} value={props.value} /></div>
  )
}

const FilterResult = ({ countries, filterText, handler }) => {

  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(filterText.toLowerCase()))

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (filteredCountries.length === 1) {
    return <div><CountryDisplay country={filteredCountries[0]} /></div>
  }

  return (
    <div>
      {filteredCountries.map((country) => 
        <CountryListItem key={country.alpha3Code} country={country} handler={handler} />
      )}
    </div>
  )
}

const CountryListItem = ({ country, handler }) => {

  return (
    <span style={{display:'block'}}>
      {country.name}
      <button onClick={() => handler(country.name)}>show</button> 
    </span>
  )
}

const CountryDisplay = ({ country }) => {
  
  return (
    <div>
      <h1>{country.name}</h1>
      <span style={{display:'block'}}>capital {country.capital}</span>
      <span style={{display:'block'}}>population {country.population}</span>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} style={{width:'128px'}} alt={`${country.name} flag`} />
      <WeatherDisplay capital={country.capital} />
    </div>
  )
}

const WeatherDisplay = ({ capital }) => {
  const [weatherData, setWeatherData] = useState()

  const key = process.env.REACT_APP_API_KEY
  const url = `http://api.weatherstack.com/current?access_key=${key}&query=${capital}`

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setWeatherData(response.data)
      })
  }, [url])

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <span style={{display:'block'}}><strong>temperature</strong>: {weatherData?.current.temperature} Celsius</span>
      <img src={weatherData?.current.weather_icons[0]} alt={weatherData?.current.weather_descriptions[0]} />
      <span style={{display:'block'}}><strong>wind</strong>: {weatherData?.current.wind_speed} mph direction {weatherData?.current.wind_dir}</span>
    </div>
  )
}

function App() {

  const [allCountries, setAllCountries] = useState([])
  const [filterText, setFilterText] = useState('')

  const handleFilterTextChange = event => setFilterText(event.target.value)
  const handleShow = (country) => setFilterText(country);

  useEffect(() => {
    axios
    .get('https://restcountries.eu/rest/v2/all')
    .then((response) => {
      setAllCountries(response.data)
    })
  }, [])


  return (
    <div className="App">
      <SearchForm handler={handleFilterTextChange} value={filterText} />
      <FilterResult countries={allCountries} filterText={filterText} handler={handleShow} />
    </div>
  );
}

export default App;
