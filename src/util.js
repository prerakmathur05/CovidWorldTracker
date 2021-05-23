//only for utilities not a component
import numeral from "numeral";

const sortData = (data) => {
  const sortedData = [...data];
  //console.log("Sorted Dta >>", sortedData);
  sortedData.sort((a, b) => {
    if (a.active > b.active) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};
const sortData2 = (data) => {
  const sortedData2 = [...data];
  sortedData2.sort((a, b) => {
    const a1 = a.confirmed - a.deceased - a.recovered;
    const b1 = b.confirmed - b.deceased - b.recovered;
    if (a1 > b1) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData2;
};

const prettyStatPrint = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0a";

export { sortData, sortData2, prettyStatPrint };
