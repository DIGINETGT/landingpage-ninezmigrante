import React from "react";
import { Box, Stack, Text } from "@chakra-ui/react";

import { useParams } from "react-router-dom";

const EntryBorderCountry = ({ data }) => {
  const filteredData =
    data?.reduce((map, country) => {
      const countryName =
        country?.attributes?.entry_border?.data?.attributes?.name;
      const total = country?.attributes?.cant;

      map[countryName] = map[countryName] ? map[countryName] + total : total;

      return map;
    }, {}) ?? {};

  return (
    <Stack px={5} spacing={5} width="100%">
      {Object.entries(filteredData ?? {})?.map(([name, total], index) => {
        return total > 0 ? (
          <Stack
            direction="row"
            width="100%"
            key={`${name?.[0]}-${index}`}
            alignItems="center"
            justifyContent="center"
          >
            <Stack
              spacing="8px"
              direction="column"
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontFamily="Oswald"
                textAlign="center"
                fontSize="md"
                lineHeight="1"
              >
                {name}
              </Text>
              <Text fontFamily="Oswald" fontSize="3xl" lineHeight="1">
                {total}
              </Text>
            </Stack>
          </Stack>
        ) : null;
      })}
    </Stack>
  );
};

export default EntryBorderCountry;
