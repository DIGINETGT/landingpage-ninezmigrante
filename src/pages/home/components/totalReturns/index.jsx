// REACT
import React, { useState, useEffect } from "react";

// CHAKRA UI COMPONENTS
import { Box, Stack, Image, Text, Tooltip } from "@chakra-ui/react";

// COMPONETS
import Group from "../../../../assets/group.png";
import Guatemala from "../../../../assets/guatemala.png";
import Honduras from "../../../../assets/honduras.png";
import Salvador from "../../../../assets/salvador.png";

// UTILS
import { year } from "../../../../utils/year";
import useFetch from "../../../../hooks/fetch";
import { useQuery } from "@apollo/client";
import { GET_RETURNEDS } from "../../../../utils/query/returned";

const TotalReturns = () => {
  const {
    data: returneds,
    loading: loadingReturned,
    error: errorReturned,
  } = useQuery(GET_RETURNEDS);

  const total = {
    gt: returneds?.returneds?.data?.reduce(
      (acc, returned) =>
        returned?.attributes?.country_contributions?.data?.reduce(
          (acc, country) =>
            country?.attributes?.country?.data?.attributes?.name === "Guatemala"
              ? acc + country?.attributes?.total
              : acc,
          0
        ),
      0
    ),
    hn: returneds?.returneds?.data?.reduce(
      (acc, returned) =>
        returned?.attributes?.country_contributions?.data?.reduce(
          (acc, country) =>
            country?.attributes?.country?.data?.attributes?.name === "Honduras"
              ? acc + country?.attributes?.total
              : acc,
          0
        ),
      0
    ),
    sv: returneds?.returneds?.data?.reduce(
      (acc, returned) =>
        returned?.attributes?.country_contributions?.data?.reduce(
          (acc, country) =>
            country?.attributes?.country?.data?.attributes?.name ===
            "El Salvador"
              ? acc + country?.attributes?.total
              : acc,
          0
        ),
      0
    ),
  };

  const tot = Number.isNaN(total.gt + total.hn + total.sv)
    ? 0
    : total.gt + total.hn + total.sv;

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
          w="160px"
          h="160px"
          src={Group}
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
            textAlign="center"
            fontFamily="Oswald"
            fontSize={{ base: "3xl", md: "4xl" }}
          >
            Total de niñez migrante retornada {year}
          </Text>

          {/* MOBILE IMAGE */}
          <Image
            w="150px"
            h="150px"
            src={Group}
            display={{ base: "block", md: "none" }}
          />

          {/* GLOBAL DATA */}
          <Text
            color="white"
            fontFamily="Oswald"
            fontSize={{ base: "5xl", md: "6xl" }}
          >
            {tot}
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
                label="Guatemala"
                bgColor="blue.500"
                fontFamily="Oswald"
              >
                <Image
                  width="35%"
                  height="70px"
                  src={Guatemala}
                  objectFit="contain"
                />
              </Tooltip>
              <Text
                color="white"
                fontFamily="Oswald"
                fontSize={{ base: "3xl", md: "4xl" }}
              >
                {Number.isNaN(total.gt) ? 0 : total.gt}
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
                label="Honduras"
                padding="2px 8px"
                bgColor="blue.500"
                fontFamily="Oswald"
              >
                <Image
                  width="45%"
                  height="70px"
                  src={Honduras}
                  objectFit="contain"
                />
              </Tooltip>
              <Text
                color="white"
                fontFamily="Oswald"
                fontSize={{ base: "3xl", md: "4xl" }}
              >
                {Number.isNaN(total.hn) ? 0 : total.hn}
              </Text>
            </Stack>

            {/* EL SALVADOR */}
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
                label="El Salvador"
                padding="2px 8px"
                bgColor="blue.500"
                fontFamily="Oswald"
              >
                <Image
                  width="45%"
                  height="70px"
                  src={Salvador}
                  objectFit="contain"
                />
              </Tooltip>
              <Text
                color="white"
                fontFamily="Oswald"
                fontSize={{ base: "3xl", md: "4xl" }}
              >
                {Number.isNaN(total.sv) ? 0 : total.sv}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalReturns;
