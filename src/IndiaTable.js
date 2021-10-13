import React from "react";
import "./Indiatable.css";
import numeral from "numeral";
import statesArray from "./Statesnames";

function IndiaTable({ states }) {
  states.map((x) => {
    statesArray.forEach((y) => {
      if (y.code === x.name) {
        //here we are converting states code into state name only
        x.name = y.name;
        //  console.log("consoling states array ", x.name);
      }
    });
  });
  return (
    <div>
      <div className="tables">
        <tr className="table__heading">
          <td className="statename">
            <strong>
              <h4>State</h4>{" "}
            </strong>
          </td>
          <td>
            <strong>
              <h4> Confirmed </h4>{" "}
            </strong>
          </td>
          <td>
            <h4> Active </h4>
          </td>
          <td>
            <h4> Recovered </h4>
          </td>

          <td>
            <strong>
              <h4> Deceased</h4>{" "}
            </strong>
          </td>
          <td>
            <strong>
              <h4> Tested </h4>{" "}
            </strong>
          </td>
          <td>
            <strong>
              <h4> Vaccinated </h4>{" "}
            </strong>
          </td>
        </tr>
      </div>
      <div className="table__content">
        {states.map((x) => (
          <tr>
            <td className="statename">
              {" "}
              <h4> {x.name} </h4>
            </td>
            <td>
              {" "}
              <strong>{numeral(x.confirmed).format("0,0")} </strong>
            </td>
            <td>
              <strong>
                {numeral(x.confirmed - x.deceased - x.recovered).format("0,0")}{" "}
              </strong>
            </td>
            <td>
              <strong>{numeral(x.recovered).format("0,0")} </strong>
            </td>
            <td>
              <strong>{numeral(x.deceased).format("0,0")} </strong>
            </td>
            <td>
              <strong>{numeral(x.tested).format("0,0")} </strong>
            </td>
            <td>
              <strong>{numeral(x.vaccinated).format("0,0")} </strong>
            </td>
          </tr>
        ))}
      </div>
    </div>
  );
}

export default IndiaTable;
//[0].AN.total.confirmed;
