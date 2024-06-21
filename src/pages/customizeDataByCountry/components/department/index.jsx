import React from "react";

import { Box } from "@chakra-ui/react";

// COMPONENTS
import Header from "./components/header";
import DnDDepartment from "./components/dndDepartment";
import useReturnedFilteredQuery from "../../../../hooks/query";
import { GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT } from "../../../../utils/query/returned";

const Department = () => {
  return (
    <Box bgColor="#d9e8e8">
      <Header />
      <DnDDepartment />;
    </Box>
  );
};

export default Department;
