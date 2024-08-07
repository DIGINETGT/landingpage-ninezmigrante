// REACT
import React from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Image } from "@chakra-ui/react";

// ASSETS
import Airplane from "../../../../../../assets/airplane.png";
import Bus from "../../../../../../assets/bus.png";
import Ship from "../../../../../../assets/ship.png";
import { GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE } from "../../../../../../utils/query/returned";
import useReturnedFilteredQuery from "../../../../../../hooks/query";
import Loader from "../../../../../../components/loader";

const ReturnPath = ({ period, year, country }) => {
  const { countryID: id } = useParams();
  const countryId = country || id;

  const { data: rdata, loading } = useReturnedFilteredQuery({
    year,
    period,
    country,
    skip: false,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE(countryId, period, year),
  });

  let totalAerea = 0;
  let totalTerrestre = 0;
  let totalMaritimo = 0;

  rdata?.forEach((report) => {
    report.attributes?.returned?.data?.attributes?.return_route_contributions?.data?.forEach(
      (routeContribution) => {
        const returnRoute =
          routeContribution.attributes?.return_route?.data?.attributes?.name?.toLowerCase();

        if (
          returnRoute.startsWith("aérea") ||
          returnRoute.startsWith("aéreo")
        ) {
          totalAerea += routeContribution.attributes?.cant || 0;
        } else if (returnRoute.startsWith("terrestre")) {
          totalTerrestre += routeContribution.attributes?.cant || 0;
        } else if (returnRoute.startsWith("marítimo")) {
          totalMaritimo += routeContribution.attributes?.cant || 0;
        }
      }
    );
  });

  return (
    <Box width="100%" position="relative">
      <Loader loading={loading} />

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

        <Stack
          gap="24px"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Image src={Ship} height="50px" />

          <Stack
            spacing="8px"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontFamily="Oswald" fontSize="md" lineHeight="1">
              Marítimo
            </Text>
            <Text fontFamily="Oswald" fontSize="3xl" lineHeight="1">
              {totalMaritimo}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ReturnPath;
