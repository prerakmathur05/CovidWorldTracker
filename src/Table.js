import React from "react";
import numeral from "numeral";
import "./table.css";

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map((x) => (
        <tr>
          <td>{x.country}</td>
          <td>
            <strong>{numeral(x.active).format("0,0")} </strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
