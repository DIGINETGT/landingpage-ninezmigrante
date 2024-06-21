// REACT
import React, { useEffect } from "react";

// COMPONENTS
import TotalByTravelCondition from "./components/totalByTravelCondition";
import CountrySelect from "./components/countrySelect";
import TotalByGender from "./components/totalByGender";
import TotalReturns from "./components/totalReturns";
import TotalBorders from "./components/totalBorders";
import TotalTransit from "./components/totalTransit";


const HomePage = () => {
  return (
    <>
      <CountrySelect />
      <TotalReturns />
      <TotalByGender />
      <TotalByTravelCondition />
      <TotalBorders />
      <TotalTransit />
    </>
  );
};

export default HomePage;
