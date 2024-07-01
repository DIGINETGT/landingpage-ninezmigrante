import React from "react";
import { Box, Stack, Text } from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { colors } from "../../../../../../utils/theme";

const ReturnCountry = ({ data, dataMaps }) => {
  const { countryID: id } = useParams();

  const filteredData =
    data?.reduce((map, country) => {
      const countryName = country?.attributes?.country?.data?.attributes?.name;
      const total = country?.attributes?.cant;

      map[countryName] = map[countryName] ? map[countryName] + total : total;

      return map;
    }, {}) ?? {};

  return (
    <Stack spacing={6} width="100%" direction="row" justifyContent="start">
      {Object.entries(filteredData ?? {})?.map(([name, total], index) => {
        return total > 0 ? (
          <Stack
            gap="24px"
            direction="column"
            key={`${name?.[0]}-${index}`}
            alignItems="center"
            justifyContent="center"
          >
            <Stack spacing="8px" direction="column" alignItems="center">
              <ReactSVG
                style={{ width: 60, height: 60 }}
                beforeInjection={(svg) => {
                  svg.setAttribute(
                    "fill",
                    colors?.heat?.[id]?.[900 - index * 100]
                  );
                  svg.setAttribute("style", "width: 100%; height: 100%");
                }}
                src={dataMaps?.[name] ?? ""}
              />

              <Text fontFamily="Oswald" fontSize="md" lineHeight="1" maxW={100}>
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

export default ReturnCountry;
