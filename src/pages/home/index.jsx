// REACT
import React, { useEffect } from "react";

// COMPONENTS
import TotalByTravelCondition from "./components/totalByTravelCondition";
import CountrySelect from "./components/countrySelect";
import TotalByGender from "./components/totalByGender";
import TotalReturns from "./components/totalReturns";
import TotalBorders from "./components/totalBorders";
import TotalTransit from "./components/totalTransit";

import { useQuery } from "@apollo/client";
import { GET_COUNTRY } from "../../utils/query/country";

const HomePage = () => {
  const emailExite = window.localStorage.getItem("popup");
  const { loading, error, data } = useQuery(GET_COUNTRY);

  const contadorVisita = async (email) => {
    // GAURDAR FORMULARIO
    fetch(`${import.meta.env.VITE_APP_API_URL}/visitas/counter/${email}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Client-ID [my-client-id]",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, Access-Control-Allow-Headers",
        "Access-Control-Allow-Methods": "PUT",
      },
    })
      .then((resp) => {
        return resp;
      })
      .then((data) => {
        if (data.status === 400) {
          return window.localStorage.removeItem("popup");
        } else {
          return console.log("Visita registrada.");
        }
      })
      .catch((err) => console.log("Error."));
  };

  useEffect(() => {
    if (emailExite) {
      contadorVisita(emailExite);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

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
