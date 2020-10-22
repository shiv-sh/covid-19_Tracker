import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select } from '@material-ui/core';
import InfoBox from './InfoBox';
import { Card, CardContent } from "@material-ui/core";
import Table from './Table';
import Map from './Map';
import { sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from './util';


// https://disease.sh/v3/covid-19/countries
// useEffect = Runs code based on given condition.
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState(
    {lat: 34.80746, lng: -40.4796}
  );
  const [mapZoom, setMapZoom] = useState(2);
  useEffect(() => {
    // aynchronous
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          let sortedData = sortData(data)
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        })
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(res => res.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, [])


  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' ?
      'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(3);
      });
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem key={country.value} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>

          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox className="app__totalCases" isRed
          active={casesType === "cases"}
          onClick={e => setCasesType('cases')}
          title="Coronavirus cases" cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases} />
          <InfoBox className="app__totalRecovered"
          active={casesType === "recovered"}
          onClick={e => setCasesType('recovered')}
          title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered} />
          <InfoBox className="app__totalDeaths" isRed
          active={casesType === "deaths"}
          onClick={e => setCasesType('deaths')}
          title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths} />

        </div>


        {/* Map */}
        <Map countries={mapCountries} casesType={casesType} 
        center={mapCenter}
        zoom={mapZoom}  />
      </div>
      <Card className="app__right">
        <CardContent>
          {/* Table */}
          {/* Graph */}
          <h3 className="app__graphTitle">Worldwide {casesType}</h3>
          <Table countries={tableData} />
        </CardContent>
        <LineGraph className="app__graph" casesType={casesType} />
      </Card>

    </div>
  );
}

export default App;
