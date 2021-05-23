import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./infobox.css";

function InfoBox({ title, cases, active, isRed, total, content, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infobox ${active && "infobox--selected"} ${
        isRed && "infobox--red"
      } ${!active && "infobox--notselected"}`}
    >
      <CardContent className="carda">
        <Typography className="infoBox__title">
          <h4> {title} </h4>
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infobox--green"}`}>
          {" "}
          {cases}{" "}
        </h2>
        <Typography className="infoBox__total">
          <h4>
            {" "}
            {total} {content}{" "}
          </h4>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
