import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import "leaflet/dist/leaflet.css";
import Table from "./Table";
import IndiaTable from "./IndiaTable";
import { sortData, sortData2, prettyStatPrint } from "./util";
import LineGraph from "./LineGraph";
import LineGraphMini from "./LineGraphMini";
//https://api.covid19india.org/v4/min/data.min.json
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("USA");
  const [otherCountry, setOtherCountry] = useState("world");
  const [countryInfo, setCountryInfo] = useState({});
  const [otherCountryInfo, setOtherCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [indiaState, changeIndiaState] = useState([]);
  const [countryCodeForGraph, setCountryCodeForGraph] = useState("usa");
  const [CountryCodeForTable, setCountryCodeForTable] = useState("usa");

  //https://disease.sh/v3/covid-19/states
  //Below code is for tabular data display between USA and India statewise
  useEffect(() => {
    const indiaData = async () => {
      //  console.log("Here is change in code table >>>> RIGHT HERE ",CountryCodeForTable);
      const arrayIndiaState = []; // just name is indiaState but data is also from usa if you select usa..
      CountryCodeForTable == "IN"
        ? await fetch("https://data.covid19india.org/v4/min/data.min.json")
            .then((response) => response.json())
            .then((data) => {
              //console.log("IndiaState Data obj >>", data);

              for (let x in data) {
                arrayIndiaState.push({
                  name: x[0] + x[1],
                  confirmed: data[x].total.confirmed,
                  recovered: data[x].total.recovered,
                  vaccinated: data[x].total.vaccinated,
                  tested: data[x].total.tested,
                  deceased: data[x].total.deceased,
                });
              }
            })
        : await fetch("https://disease.sh/v3/covid-19/states")
            .then((response) => response.json())
            .then((data) => {
              //console.log("USAState Data obj new wala hai yeh yaad rakhna >>",data );
              for (let x in data) {
                arrayIndiaState.push({
                  name: data[x].state,
                  confirmed: data[x].cases,
                  recovered: data[x].recovered,
                  tested: data[x].tests,
                  deceased: data[x].deaths,
                });
              }
            });
      //console.log("Final Array India Data ", arrayIndiaState);
      const sortedIndiaData = sortData2(arrayIndiaState);
      changeIndiaState(sortedIndiaData);
    };
    indiaData();
  }, [CountryCodeForTable]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries/IN")
      .then((response) => response.json())
      .then((data) => {
        const data2 = data;
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setOtherCountryInfo(data);
      });
  }, []);
  //USEFFECT = Runs a piece of code based on given condition
  //it runs only once when the component loads or when the parameter variable changes
  //and not after
  useEffect(() => {
    //async -> send a request to server , wait for it, do something with it
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          //console.log("here it is json", data);
          const countriesArray = data.map((country) => ({
            name: country.country, //United States, United Kingdom
            value: country.countryInfo.iso2, //UK, USA
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countriesArray);
          //  console.log(countriesArray);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountryCodeForTable(countryCode);
    //console.log("you choose", countryCode);
    const url =
      countryCode === "USA"
        ? "https://disease.sh/v3/covid-19/countries/USA"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    //  console.log("url >>", url);
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setCountryCodeForGraph(countryCode);
        // console.log("countryCOed", countryCodeForGraph);
      });
  };
  const onOtherCountryChange = async (event) => {
    const countryCode = event.target.value;
    // console.log("you choose", countryCode);
    const url =
      countryCode === "world"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    //  console.log("url >>", url);
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setOtherCountry(countryCode);
        setOtherCountryInfo(data);
      });
  };
  //console.log("Country Info >>>", countryInfo);
  return (
    //state is hopw to write variables in react
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 Live Tracker</h1>
          <div className="app__dropdown">
            <FormControl>
              <Select
                onChange={onCountryChange}
                value={country}
                label={country}
                variant="outlined"
              >
                <MenuItem value="USA">United States</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="app__stats">
          {/*console.log("here its isbdgb", country)*/}
          <InfoBox
            isRed
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            title="Todays's Coronavirus cases"
            cases={prettyStatPrint(countryInfo.todayCases)}
            total={prettyStatPrint(countryInfo.cases)}
            content={"Total"}
          />
          <InfoBox
            isRed
            onClick={(e) => setCasesType("cases")}
            active={casesType === "active"}
            title="Active Coronavirus cases"
            cases={prettyStatPrint(countryInfo.active)}
          />

          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            title="Today's Recovered"
            cases={prettyStatPrint(countryInfo.todayRecovered)}
            total={prettyStatPrint(countryInfo.recovered)}
            content={"Total"}
          />

          <InfoBox
            isRed
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            title="Today's Deceased"
            cases={prettyStatPrint(countryInfo.todayDeaths)}
            total={prettyStatPrint(countryInfo.deaths)}
            content={"Total"}
          />
        </div>
        {/* <Map /> */}
        <Card className="card_color">
          <CardContent className="indiaGraphs">
            <h2>
              Let's check the stats of {country} in {casesType}{" "}
            </h2>
            <LineGraph casesType={casesType} country={countryCodeForGraph} />
            <h2> Let's look at the {country} States </h2>
            <IndiaTable states={indiaState} />
          </CardContent>
        </Card>

        {/* PART 2//////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2 */}

        <div className="app__header">
          <h2> World wide cases </h2>
          <FormControl className="app__dropdown">
            <Select
              className="otherdropdown"
              variant="outlined"
              onChange={onOtherCountryChange}
              value={otherCountry}
            >
              <MenuItem value="world">World Wide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          {/*console.log("here its isbdgb", country)*/}
          <InfoBox
            isRed
            title="Todays's Coronavirus cases"
            cases={prettyStatPrint(otherCountryInfo.todayCases)}
            total={prettyStatPrint(otherCountryInfo.cases)}
            content={"Total"}
          />
          <InfoBox
            isRed
            title="Active Coronavirus cases"
            cases={prettyStatPrint(otherCountryInfo.active)}
          />

          <InfoBox
            title="Today's Recovered"
            cases={prettyStatPrint(otherCountryInfo.todayRecovered)}
            total={prettyStatPrint(otherCountryInfo.recovered)}
            content={"Total"}
          />

          <InfoBox
            isRed
            title="Today's Deceased"
            cases={prettyStatPrint(otherCountryInfo.todayDeaths)}
            total={prettyStatPrint(otherCountryInfo.deaths)}
            content={"Total"}
          />
        </div>
      </div>

      <Card className="app__right card__color">
        <CardContent className="card__color">
          <h3>Live cases by countries</h3>
          <Table countries={tableData} />

          <h3>Worldwide new {casesType}</h3>
          <LineGraphMini casesType={casesType} country={"all"} />
          <p>
            {" "}
            Hi there! I am a passionate developer who believes in simplifying
            life of people around me! connect with me on{" "}
            <a href="https://github.com/prerakmathur05/" target="_blank">
              Github{" "}
            </a>{" "}
          </p>
          <p>
            {" "}
            Sources
            <ul>
              <li>
                {" "}
                <a href="https://www.disease.sh" target="_blank">
                  {" "}
                  disease.sh
                </a>{" "}
              </li>
              <li>
                <a href="https://www.covid19india.org/" target="_blank">
                  Covid19 India
                </a>
              </li>
              <li>
                {" "}
                <a
                  href="https://www.worldometers.info/coronavirus/"
                  target="_blank"
                >
                  {" "}
                  Covid worldometers
                </a>{" "}
              </li>
            </ul>
          </p>
          <p> © Copyright 2021 @ Prerak Mathur </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

/*<MenuItem value="United States">United States</MenuItem>
            <MenuItem value="Switzerland">Switzerland</MenuItem> */

/* loop through the countries drop down list */
//countryInfo.iso2;
