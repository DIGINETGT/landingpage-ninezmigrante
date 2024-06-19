// REACT
import React, { useState, useEffect } from "react";

// CHAKRA UI
import { Box, Stack, Text, Image, Divider } from "@chakra-ui/react";

// ASSETS
import Family from "../../../../assets/family.png";

// UTILS
import { year } from "../../../../utils/year";
import useFetch from "../../../../hooks/fetch";
import { GET_RETURNEDS_BY_TRAVEL_CONDITION } from "../../../../utils/query/returned";

const TotalByTravelCondition = () => {
  const { data, loading, error } = useQuery(GET_RETURNEDS_BY_TRAVEL_CONDITION);

  const acm = data?.travel_condition_contributions?.data?.reduce(
    (acc, b) =>
      b?.attributes?.travel_condition?.attributes?.name === "Acompañado"
        ? acc + b?.attributes?.cant
        : acc,
    0
  );

  const noAcm = data?.travel_condition_contributions?.data?.reduce(
    (acc, b) =>
      b?.attributes?.travel_condition?.attributes?.name === "No acompañado"
        ? acc + b?.attributes?.cant
        : acc,
    0
  );

  const total = { acm, noAcm };

  return (
    <Box bg="blue.500" p={{ base: "40px 24px", md: "80px 40px" }}>
      {/* CONTAINER */}
      <Stack spacing="40px" padding={{ base: "16px", md: "24px" }}>
        {/* TITLE */}
        <Stack justifyContent="center" alignItems="center" textAlign="center">
          <Text fontFamily="Oswald" fontSize={{ base: "3xl", md: "4xl" }}>
            Total de niñez migrante retornada {year}
          </Text>
        </Stack>

        {/* DATA */}
        <Stack
          gap={{ base: "40px", md: "80px" }}
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
        >
          {/* IMAGE */}
          <Image
            w={{ base: "150px", md: "200px" }}
            h={{ base: "150px", md: "200px" }}
            src={Family}
          />

          <Stack direction="column" w={{ base: "100%", md: "auto" }}>
            {/* SUBTITLE  */}
            <Stack
              w="100%"
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap="40px"
            >
              <Text fontFamily="Oswald" fontSize={{ base: "2xl", md: "5xl" }}>
                ACOMPAÑADOS
              </Text>
              <Text fontFamily="Oswald" fontSize={{ base: "3xl", md: "7xl" }}>
                {total.acm}
              </Text>
            </Stack>

            {/* DIVIDER */}
            <Divider
              orientation="horizontal"
              borderColor="#000"
              borderWidth="1px"
            />

            {/* SUBTITLE */}
            <Stack
              w="100%"
              justifyContent="space-between"
              alignItems="center"
              direction="row"
              gap="40px"
            >
              <Text fontFamily="Oswald" fontSize={{ base: "2xl", md: "5xl" }}>
                NO ACOMPAÑADOS
              </Text>
              <Text fontFamily="Oswald" fontSize={{ base: "3xl", md: "7xl" }}>
                {total.noAcm}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalByTravelCondition;
