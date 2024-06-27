import React from "react";

import { Box } from "@chakra-ui/react";

// COMPONENTS
import Header from "./components/header";
import DnDDepartment from "./components/dndDepartment";

const Department = () => {
  return (
    <Box bgColor="#d9e8e8">
      <Header />
      <DnDDepartment />;
    </Box>
  );
};

export default Department;
