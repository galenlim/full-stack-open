import { useState, useEffect } from 'react'
import axios from 'axios'

const SearchForm = (props) => {

  return (
    <div>find countries <input type='text' onChange={props.handler}/></div>
  )
}

const FilterResult = ({ countries, filterText }) => {
  if (!countries) {
    return <div><CountryDisplay /></div>
  }
  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(filterText.toLowerCase()))

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (filteredCountries.length === 1) {
    return <div><CountryDisplay country={filteredCountries[0]} /></div>
  }

  return (
    <div>
      {filteredCountries.map((country) => <span key={country.alpha3Code} style={{display:'block'}}>{country.name}</span>)}
    </div>
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
    </div>
  )
}

function App() {

  const [allCountries, setAllCountries] = useState([])
  const [filterText, setFilterText] = useState('')

  const handleFilterTextChange = event => setFilterText(event.target.value)

  useEffect(() => {
    axios
    .get('https://restcountries.eu/rest/v2/all')
    .then((response) => {
      setAllCountries(response.data)
    })
  }, [])


  return (
    <div className="App">
      <SearchForm handler={handleFilterTextChange} />
      <FilterResult countries={allCountries} filterText={filterText} />
    </div>
  );
}

export default App;
