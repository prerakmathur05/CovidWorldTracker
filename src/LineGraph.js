import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import "./graph.css";
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
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

// "https://disease.sh/v3/covid-19/all?lastdays=120"
function buildChartData(data, casesType) {
  // console.log("cvgvc", casesType);
  let chartData = [];
  let lastDataPoint;
  const type = casesType;
  // console.log("logging data.cases1", data[type]);
  for (let date in data[type]) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }

  return chartData;
}
function LineGraph({ casesType, country }) {
  const [ourData, setOurData] = useState({});
  // console.log("here is country name ", country);
  const url = `https://disease.sh/v3/covid-19/historical/${country}?lastdays=360`;
  //console.log("url", url);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data.timeline, casesType);
          setOurData(chartData);

          //  console.log("chartData 11>>>", chartData);
        });
    };

    fetchData();
  }, [casesType, country]);

  // console.log("OurData  >>>", ourData);

  return (
    <div className="graph">
      {ourData?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
                data: ourData,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}
export default LineGraph;
