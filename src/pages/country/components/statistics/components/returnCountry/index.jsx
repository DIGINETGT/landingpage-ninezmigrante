// REACT
import React from "react";
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
  ["Estados Unidos"]: { Image: EEUU },
  ["México"]: { Image: Mexico },
  ["Guatemala"]: { Image: Guatemala },
  ["El Salvador"]: { Image: ElSalvador },
  others: { Image: AmericaMap },
};

const ReturnCountry = ({ period, year, country }) => {
  const { countryID: id } = useParams();
  const countryId = country || id;

  const rdata = useReturnedFilteredQuery({
    year,
    period,
    country,
    skip: false,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY(countryId),
  });

  const dataPerCountry = {};

  rdata?.forEach((report) => {
    report.attributes?.returned?.data?.attributes?.country_contributions?.data?.forEach(
      (countryContribution) => {
        const countryName =
          countryContribution.attributes?.country?.data?.attributes?.name;

        dataPerCountry[countryName] =
          (dataPerCountry[countryName] ?? 0) +
          +(countryContribution?.attributes?.cant ?? 0);
      }
    );
  });

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
        {Object.entries(dataPerCountry)
          .sort((a, b) => b[1].total - a[1].total)
          .map(([country, total], index) => {
            const Map = countryImages?.[country]?.Image;

            return total > 0 ? (
              <Stack
                gap="24px"
                direction="column"
                key={`${country[0]}-${index}`}
                alignItems="center"
                justifyContent="center"
              >
                {<Map color={colors.heat[countryId][900 - index * 100]} />}

                <Stack
                  spacing="8px"
                  direction="column"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text
                    fontFamily="Oswald"
                    fontSize="md"
                    lineHeight="1"
                    textAlign="center"
                  >
                    {country}
                  </Text>
                  <Text
                    fontFamily="Oswald"
                    fontSize="3xl"
                    lineHeight="1"
                    textAlign="center"
                  >
                    {total}
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
