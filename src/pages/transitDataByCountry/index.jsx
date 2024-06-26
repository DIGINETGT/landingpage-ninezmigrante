import React from "react";
import { Stack } from "@chakra-ui/react";

import Header from "./components/header";
import Statistics from "./components/statistics";

const TransitDataByCountry = () => {
  return (
    <Stack bgColor="#d9e8e8" spacing="40px">
      <Header />
      <Statistics />
    </Stack>
  );
};

export default TransitDataByCountry;
