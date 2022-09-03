import React,{useEffect, useState} from 'react';
import "./App.css";
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Infobox from './Infobox';
import Map from './Map';
import { Card ,CardContent} from '@mui/material';
import Table from "./Table.js";
// import LineGraph from './LineGraph';
import Graph from "./Graph.js"
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';



function App() {
   const [countries,setCountries] = useState([]);
   const [country, setCountry] = useState("worldwide");
   const [countryInfo, setCountryInfo] = useState("");
   const [tableData, setTableData] = useState([]);
   const [mapCenter,setMapCenter] = useState({lat:34.8076, lng:-40.4796});
   const [mapZoom, setMapZoom] = useState(3);
   const [mapCountries,setMapCountries] = useState([]);
   const [casesType, setCasesType] = useState("cases");


   useEffect(()=>{
        fetch("https://disease.sh/v3/covid-19/all")
        .then(response=>response.json())
        .then(data =>{
          setCountryInfo(data)
        })
   },[])

   useEffect(()=>{
    const getCountriesData = async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const sortedData = data.sort((a,b)=>{return b.case-a.cases});
        const countries = sortedData.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2,
          todayCases:country.todayCases,
          cases:country.cases
        }))
        setCountries(countries);

        setTableData(data.sort((a,b)=>{return b.cases-a.cases}));
        setMapCountries(data);
      })
    }
   getCountriesData();
    },[]);


async function handleChange(event){
  setCountry(event.target.value);

  const url = event.target.value==="worldwide"? "https://disease.sh/v3/covid-19/all":`https://disease.sh/v3/covid-19/countries/${event.target.value}`
  await fetch(url)
  .then(response=>response.json())
  .then(data=>{
    console.log("Hi")
    setCountryInfo(data);
   console.log(data)
    setMapCenter({lat:data.countryInfo.lat,lng:data.countryInfo.long});
    console.log(mapCenter)
    setMapZoom(4)
  })
}


const prettyPrint = (stat)=>(
  stat? `+${numeral(stat).format("0.0a")}`:"+0"
)




  return (
    <div className='app'>
    <div className='app__leftandright'>
      <div className='app__left'>
        <div className='app__header'>
          {
          console.log(mapZoom)
          }
        <h1>COVID-19 TRACKER</h1>
        <FormControl  className='app__dropdown'>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value= {country}
          label="Age........"
          onChange={handleChange}
        >
          <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.sort((a,b)=>{return b.todayCases-a.todayCases}).map((country)=>(
           <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
        </Select>
        </FormControl>
        </div>
        
        <div className='app__stats'>
           <Infobox onClick={e=>setCasesType("cases")} title="Coronavirus Cases" cases ={prettyPrint(countryInfo.todayCases)} total={countryInfo.cases} />
           <Infobox onClick={e=>setCasesType("recovered")} title="Recovered" cases ={prettyPrint(countryInfo.todayRecovered)} total={countryInfo.recovered}/>
           <Infobox onClick={e=>setCasesType("deaths")} title="Death" cases ={prettyPrint(countryInfo.todayDeaths)} total={countryInfo.deaths} />
        </div>
       {console.log(casesType)}
         <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom}/>
         </div>
         <div className="app__right">
        <Card className="app__right__top">
          <CardContent>
            <h2>Live Cases by Country</h2>
            <Table countries = {tableData} />
          </CardContent>
        </Card>
        <Card className="app__right__bottom">
          <CardContent>
            <h2>Worldwide New </h2>
            <Graph className="lineGraph" />
            {/* <LineGraph className="lineGraph" caseType={casesType}/> */}
        </CardContent>
        </Card>
        </div>
    </div>
    </div>
  )
}

export default App;