import React,{useEffect, useState} from 'react';
import "./LineGraph.css";
import {Line} from "react-chartjs-2";
import numeral from "numeral";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
//   import { Chart } from 'react-chartjs-2'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )


function LineGraph({caseType}) {
    const [data,setData] = useState({});
    const [cType, setCType] = useState(caseType);

    const options={
        plugins: {
            legend: {
              display: false
            }
          },
        legend:{
            display:true,
        },
        elements:{
            point:{
                raius:0,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips:{
            mode:"index",
            intersect:false,
            callbacks:{
                label: function(tooltipItem){
                    return numeral(tooltipItem.value).format("+0,0");
                },
            },
        },
        scales:{
            xAxes:[{
                type:"time",
                time:{
                    format:"MM:DD:YY",
                    tooltipFormat:"ll"
                }
            }],
            yAxes:[
                {
                    gridLines:{
                        display:false,
                    },
                    ticks:{
                        callback:function(value,index,values){
                            return numeral(value).format("0a");
                        }
                    }
                }
            ]
        }
    }




    const buildChartData = (data, casesType="cases")=>{
        const chartData = [];
        let lastDataPoint;
        for(let date in data[casesType]){
            if(lastDataPoint){
                const newDataPoint = {
                    x:date,
                    y:data[casesType][date]-lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date]
        }
  return chartData;
    }

   useEffect(()=>{
    const fetchData = async()=>{
        await  fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=60")
        .then(response=>response.json())
        .then(dat=>{
            console.log(dat)
            const chartData = buildChartData(dat,"cases")
            setData(chartData);
        })    
    }
    fetchData();
      },[cType])

  return (
    <div className='lineGraph'>
{data?.length>0 && 
    <Line  options = {options} data={{
            datasets:[{
                data:data,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
            }]
        }}  /> 
}
    </div>
  )
}

export default LineGraph;