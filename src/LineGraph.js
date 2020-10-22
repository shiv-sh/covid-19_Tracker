import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import './LineGraph.css';
import numeral from "numeral";


const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {

                }
            }
        ]
    }
}

function LineGraph({ casesType, ...props }) {
    console.log(casesType)
    const [data, setData] = useState({});
    // https://disease.sh/v3/covid-19/historical/all?lastdays=120

    const buildChartData = (data, casesType ) => {
        const chartData = [];
        let lastDataPoint;

        for (let date in data[casesType]) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }

        return chartData;
    }


    useEffect(() => {
        const fetchData = async () => {
            fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then(res => res.json())
                .then(data => {
                    const chartDataDisplay = buildChartData(data, casesType);
                    setData(chartDataDisplay)
                });
        }
        fetchData();

    }, [casesType]);


    return (
        <div className={props.className}>
            {data.length > 0 && 
            <Line
                options={options}
                data={{
                    datasets: [
                        {
                            backgroundColor: "rgba(204, 16, 52,0.5)",
                            borderColor: "#cc1034",
                            data: data
                        }
                    ]
                }} />
            }
        </div>
    )
}

export default LineGraph;