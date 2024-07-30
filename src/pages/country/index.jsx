// REACT
import React, { useState, useRef, useEffect } from "react";

// REACT ROUTER DOM
import { useParams } from "react-router-dom";

// COMPONENTS
import Period from "./components/period";
import Statistics from "./components/statistics";

const CountryPage = () => {
  // PERIOD
  const [period, setPeriod] = useState([]);
  const [year, setYear] = useState("");
  const satisticsRef = useRef(null);

  const { countryID } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [countryID]);

  return (
    <>
      <Period
        satisticsRef={satisticsRef}
        setPeriod={setPeriod}
        setYear={setYear}
        period={period}
        year={year}
      />
      {period.length > 0 && year && (
        <Statistics
          satisticsRef={satisticsRef}
          setPeriod={setPeriod}
          setYear={setYear}
          period={period}
          year={year}
        />
      )}
    </>
  );
};

export default CountryPage;
