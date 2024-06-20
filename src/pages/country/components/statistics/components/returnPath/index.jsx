// REACT
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Image } from "@chakra-ui/react";

import useFetch from "../../../../../../hooks/fetch";

// ASSETS
import Airplane from "../../../../../../assets/airplane.png";
import Bus from "../../../../../../assets/bus.png";
import {
  GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE,
  GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION,
} from "../../../../../../utils/query/returned";
import useReturnedFilteredQuery from "../../../../../../hooks/query";

const ReturnPath = ({ period, year, country }) => {
  const rdata = useReturnedFilteredQuery({
    year,
    period,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE,
  });

  let totalAerea = 0;
  let totalTerrestre = 0;

  rdata?.forEach((report) => {
    report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.country_contributions?.data?.forEach(
      (contribution) => {
        contribution.attributes?.returned?.data?.attributes?.return_route_contributions?.data?.forEach(
          (routeContribution) => {
            const returnRoute =
              routeContribution.attributes?.return_route?.data?.attributes?.name?.toLowerCase();

            if (returnRoute.startsWith("aérea")) {
              totalAerea += routeContribution.attributes?.cant || 0;
            } else if (returnRoute.startsWith("terrestre")) {
              totalTerrestre += routeContribution.attributes?.cant || 0;
            }
          }
        );
      }
    );
  });

  return (
    <Box width="100%">
      <Stack justifyContent="center" alignItems="center" spacing="24px">
        <Text fontFamily="Oswald" fontSize="2xl">
          Vía de retorno
        </Text>
        <Stack
          gap="24px"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Image src={Airplane} height="50px" />

          <Stack
            spacing="8px"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontFamily="Oswald" fontSize="md" lineHeight="1">
              Aérea
            </Text>
            <Text fontFamily="Oswald" fontSize="3xl" lineHeight="1">
              {totalAerea}
            </Text>
          </Stack>
        </Stack>

        <Stack
          gap="24px"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Image src={Bus} height="50px" />

          <Stack
            spacing="8px"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontFamily="Oswald" fontSize="md" lineHeight="1">
              Terrestre
            </Text>
            <Text fontFamily="Oswald" fontSize="3xl" lineHeight="1">
              {totalTerrestre}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ReturnPath;
