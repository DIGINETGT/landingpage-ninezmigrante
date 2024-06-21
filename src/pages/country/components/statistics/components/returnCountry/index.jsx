// REACT
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Image } from "@chakra-ui/react";

// ASSETS
import EEUU from "./components/polygons/eeuu";
import Mexico from "./components/polygons/mexico";
import Guatemala from "./components/polygons/guatemala";
import ElSalvador from "./components/polygons/elsalvador";
import AmericaMap from "./components/polygons/america";

import { colors } from "../../../../../../utils/theme";
import { GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY } from "../../../../../../utils/query/returned";

import useReturnedFilteredQuery from "../../../../../../hooks/query";

const countryImages = {
  eu: { Image: EEUU },
  mx: { Image: Mexico },
  nextCountryG: { Image: Guatemala },
  nextCountryH: { Image: ElSalvador },
  others: { Image: AmericaMap },
};

const defaultTotals = {
  eu: { name: "", total: 0 },
  mx: { name: "", total: 0 },
  nextCountryG: { name: "", total: 0 },
  nextCountryH: { name: "", total: 0 },
  others: { name: "", total: 0 },
};

const ReturnCountry = ({ period, year, country }) => {
  const countryID = useParams().countryID || country;

  const rdata = useReturnedFilteredQuery({
    year,
    period,
    country,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY,
  });

  let totalEstadosUnidos = 0;
  let totalMexico = 0;

  rdata?.forEach((report) => {
    report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.country_contributions?.data?.forEach(
      (contribution) => {
        contribution.attributes?.returned?.data?.attributes?.country_contributions?.data?.forEach(
          (countryContribution) => {
            const countryName =
              countryContribution.attributes?.country?.data?.attributes?.name;

            if (countryName === "Estados Unidos") {
              totalEstadosUnidos += countryContribution.attributes?.cant || 0;
            } else if (countryName === "México") {
              totalMexico += countryContribution.attributes?.cant || 0;
            }
          }
        );
      }
    );
  });

  const total = {
    eu: { name: "Estados Unidos", total: totalEstadosUnidos },
    mx: { name: "México", total: totalMexico },
  };

  return (
    <Box width="100%">
      <Stack justifyContent="center" alignItems="center" marginBottom="24px">
        <Text fontFamily="Oswald" fontSize="2xl">
          País de retorno
        </Text>
      </Stack>

      <Stack
        spacing="24px"
        justifyContent="center"
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "center", md: "flex-end" }}
      >
        {Object.entries(total)
          .sort((a, b) => b[1].total - a[1].total)
          .map((country, index) => {
            const Map = countryImages[country[0]].Image;

            return country[1].total > 0 ? (
              <Stack
                gap="24px"
                direction="column"
                key={`${country[0]}-${index}`}
                alignItems="center"
                justifyContent="center"
              >
                {<Map color={colors.heat[countryID][900 - index * 100]} />}

                <Stack
                  spacing="8px"
                  direction="column"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text fontFamily="Oswald" fontSize="md" lineHeight="1">
                    {country[1].name}
                  </Text>
                  <Text fontFamily="Oswald" fontSize="3xl" lineHeight="1">
                    {country[1].total}
                  </Text>
                </Stack>
              </Stack>
            ) : null;
          })}
      </Stack>
    </Box>
  );
};

export default ReturnCountry;
