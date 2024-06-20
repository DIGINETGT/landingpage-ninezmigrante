// REACT
import React, { useState, useEffect } from "react";

// CHAKRA UI COMPONENTS
import { Box, Stack, Image, Text, Tooltip } from "@chakra-ui/react";

// COMPONETS
import Mexico from "../../../../assets/mexico.svg";
import USA from "../../../../assets/usa.svg";
import Family from "../../../../assets/family.png";

// UTILS
import { year } from "../../../../utils/year";
import useFetch from "../../../../hooks/fetch";
import { GET_TRANSIT_REPORTS } from "../../../../utils/query/returned";
import { useQuery } from "@apollo/client";

const TotalTransit = () => {
  const { data, loading, error } = useQuery(GET_TRANSIT_REPORTS);

  // Recorre los datos devueltos por el query
  let totalCant = 0;
  data?.transitReports?.data.forEach((report) => {
    report.attributes?.country_contributions?.data.forEach((contribution) => {
      // Suma los valores de "cant"
      totalCant += contribution.attributes.cant;
    });
  });

  return (
    <Box bg="blue.500" p={{ base: "40px 24px", md: "80px 40px" }}>
      {/* CONTAINER */}
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={{ base: "0px", md: "40px" }}
        padding={{ base: "16px", md: "24px" }}
        direction={{ base: "column", md: "row" }}
      >
        {/* DESKTOP IMAGE */}
        <Image
          w="180px"
          h="180px"
          src={Family}
          display={{ base: "none", md: "block" }}
        />
        {/* DATA */}
        <Stack
          direction="column"
          justifyContent="center"
          gap={{ base: "24px", md: "0px" }}
          alignItems={{ base: "center", md: "flex-start" }}
        >
          {/* TITLE */}
          <Text
            maxWidth="600px"
            fontFamily="Oswald"
            fontSize={{ base: "3xl", md: "4xl" }}
            textAlign={{ base: "center", md: "left" }}
          >
            Total de NIÑEZ en TRANSITO {year}
          </Text>

          {/* MOBILE IMAGE */}
          <Image
            w="150px"
            h="150px"
            src={Family}
            display={{ base: "block", md: "none" }}
          />

          {/* GLOBAL DATA */}
          <Text fontFamily="Oswald" fontSize={{ base: "5xl", md: "6xl" }}>
            {Number(totalCant)}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalTransit;
