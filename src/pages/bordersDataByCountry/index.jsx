// REACT
import React, { useEffect } from "react";

// REACT ROUTER DOM
import { useParams } from "react-router-dom";

import Statistics from "./components/statistics";
import Header from "./components/header";
import Statistics from "./components/statistics";
import Compare from "./components/compare";

const BordersDataByCountry = () => {
  const { countryID } = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [countryID]);

  return (
    <>
      <Header />
      <Statistics />
      <Compare />
    </>
  );
};

export default BordersDataByCountry;
