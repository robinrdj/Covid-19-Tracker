import React,{useState,useEffect} from 'react';
import "./Map.css";
import { MapContainer, TileLayer} from "react-leaflet";
import { useMap } from 'react-leaflet';
import {Circle, Popup} from "react-leaflet";
import numeral from 'numeral';


function Map({countries,casesType, center,zoom}) {

  const [color,setColor] = useState("#cc1034");
  
  useEffect(()=>{
     if(casesType==="cases"){
        setColor("#cc1034")
     }else if(casesType==="recoveres"){
      setColor("#7dd71d");
     }else{
       setColor("#fb4443")
     }
  },[casesType])

  
   const casesTypeColors={
      cases:{
         multiplier:800*10   
      },
      recovered:{
        multiplier: 800*8
      },
      deaths:{
        multiplier:2000*10
      }
   }

  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }


const showDataOnMap=(data, casesType={casesType})=>(
     data.map(country=>(
      <Circle  center={[country.countryInfo.lat, country.countryInfo.long]} 
                fillOpacity={0.4} 
                color={color}
                fillcolor={color}
                radius={
                  Math.sqrt((country[casesType])*casesTypeColors[casesType].multiplier)
                }
      >
      <Popup>
        <div className='popup__Container'>
          <div className="popup__flag" style={{backgroundImage:`url(${country.countryInfo.flag})`}}></div>
          <div className='popup__country'>{country.country}</div>
          <div className='popup__cases'>Cases:{numeral(country.cases).format("0,0")}</div>
          <div className='popup__recovered'>Recovered:{numeral(country.recovered).format("0,0")}</div>
          <div className='popup__deaths'>Deaths:{numeral(country.deaths).format("0,0")}</div>
       </div>
      </Popup>
      </Circle>
     ))
 )


  return (
    <div className='map'>
      <MapContainer center={center} zoom={zoom}>
        <ChangeView center={center} zoom={zoom} /> 
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy;<a href="http://osm.org/copyright">openStreetMap</a>contributors' 
        />
        {showDataOnMap(countries, casesType)}
      </MapContainer>
      </div>
  )
}

export default Map;