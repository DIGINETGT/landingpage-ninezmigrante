// REACT
import React, { useState, useEffect } from "react";

// CHAKRA UI COMPONENTS
import { Box, Stack, Image, Text, Tooltip } from "@chakra-ui/react";

// COMPONETS
import Mexico from "../../../../assets/mexico.svg";
import USA from "../../../../assets/usa.svg";
import Police from "../../../../assets/police.png";

// UTILS
import { year } from "../../../../utils/year";
import useFetch from "../../../../hooks/fetch";
import {
  GET_DETAINED_IN_BORDERDS,
  GET_RETURNEDS_BY_TRAVEL_CONDITION,
} from "../../../../utils/query/returned";
import { useQuery } from "@apollo/client";

const TotalBorders = () => {
  const { data, loading, error } = useQuery(GET_DETAINED_IN_BORDERDS);

  // Inicializa las variables para las sumas
  let totalDetainedInMexicoBorders = 0;
  let totalDetainedInUSBorders = 0;

  // Recorre los datos devueltos por el query
  data?.detainedInBordersReports?.data.forEach((report) => {
    if (
      report.attributes?.reportDate?.split("-")?.[0]?.toString() !==
      year.toString()
    )
      return;

    const countryName = report.attributes.country.data.attributes.name;

    if (countryName === "México") {
      report.attributes.detained_in_borders.data.forEach((detained) => {
        totalDetainedInMexicoBorders += detained.attributes?.total;
      });
    }

    if (countryName === "Estados Unidos") {
      report.attributes.detained_us_borders.data.forEach((detained) => {
        totalDetainedInUSBorders += detained.attributes?.total;
      });
    }
  });

  console.log(
    "Total Detained in Mexico Borders:",
    totalDetainedInMexicoBorders
  );
  console.log("Total Detained in US Borders:", totalDetainedInUSBorders);

  return (
    <Box bg="blue.700" p={{ base: "40px 24px", md: "80px 40px" }}>
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
          src={Police}
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
            color="white"
            maxWidth="600px"
            fontFamily="Oswald"
            fontSize={{ base: "3xl", md: "4xl" }}
            textAlign={{ base: "center", md: "left" }}
          >
            Total de NIÑEZ detenida en FRONTERA {year}
          </Text>

          {/* MOBILE IMAGE */}
          <Image
            w="150px"
            h="150px"
            src={Police}
            display={{ base: "block", md: "none" }}
          />

          {/* GLOBAL DATA */}
          <Text
            color="white"
            fontFamily="Oswald"
            fontSize={{ base: "5xl", md: "6xl" }}
          >
            {Number.isNaN(
              Number(totalDetainedInMexicoBorders) +
                Number(totalDetainedInUSBorders)
            )
              ? 0
              : Number(totalDetainedInMexicoBorders) +
                Number(totalDetainedInUSBorders)}
          </Text>

          {/* DATA PER COUNTRY */}
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing="0px"
            width="100%"
          >
            {/* GUATEMALA */}
            <Stack
              height="100px"
              direction="row"
              padding="16px 24px"
              alignItems="center"
              border="1px solid white"
              width={{ base: "100%", md: "200px" }}
              spacing={{ base: "40px", md: "16px" }}
              justifyContent={{ base: "center", md: "space-between" }}
            >
              <Tooltip
                color="black"
                fontSize="xl"
                lineHeight="1"
                fontWeight="500"
                padding="2px 8px"
                label="México"
                bgColor="blue.500"
                fontFamily="Oswald"
              >
                <Image
                  src={Mexico}
                  width="40%"
                  height="70px"
                  objectFit="contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </Tooltip>
              <Text
                color="white"
                fontFamily="Oswald"
                fontSize={{ base: "3xl", md: "4xl" }}
              >
                {totalDetainedInMexicoBorders}
              </Text>
            </Stack>

            {/* HONDURAS */}
            <Stack
              height="100px"
              direction="row"
              padding="16px 24px"
              alignItems="center"
              border="1px solid white"
              width={{ base: "100%", md: "200px" }}
              spacing={{ base: "40px", md: "16px" }}
              justifyContent={{ base: "center", md: "space-between" }}
            >
              <Tooltip
                color="black"
                fontSize="xl"
                lineHeight="1"
                fontWeight="500"
                label="Estados Unidos"
                padding="2px 8px"
                bgColor="blue.500"
                fontFamily="Oswald"
              >
                <Image
                  src={USA}
                  width="35%"
                  height="70px"
                  objectFit="contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </Tooltip>
              <Text
                color="white"
                fontFamily="Oswald"
                fontSize={{ base: "3xl", md: "4xl" }}
              >
                {totalDetainedInUSBorders}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalBorders;
