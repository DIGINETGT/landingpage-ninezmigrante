// REACT
import React from "react";

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Image, Tooltip } from "@chakra-ui/react";

// ASSETS
import Male from "../../../../../../assets/male.png";
import Femenine from "../../../../../../assets/femenine.png";

import { GET_RETURNEDS_BY_COUNTRY_FOR_GENDER } from "../../../../../../utils/query/returned";
import useReturnedFilteredQuery from "../../../../../../hooks/query";
import { useParams } from "react-router-dom";

const Gender = ({ period, year, skip, country, defData }) => {
  const { countryID: id } = useParams();
  const countryId = country || id;

  const data = useReturnedFilteredQuery({
    skip,
    year,
    period,
    country,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_GENDER(countryId),
  });

  let tfemale = defData?.female ?? 0;
  let tmale = defData?.male ?? 0;

  data?.forEach((report) => {
    report.attributes?.returned?.data?.attributes?.gender_contributions?.data?.forEach(
      (genderContribution) => {
        const gender =
          genderContribution.attributes?.gender?.data?.attributes?.name?.toLowerCase();

        if (gender === "femenino") {
          tfemale += genderContribution.attributes?.cant || 0;
        } else if (gender === "masculino") {
          tmale += genderContribution.attributes?.cant || 0;
        }
      }
    );
  });

  return (
    <Box width="100%">
      <Stack justifyContent="center" alignItems="center" spacing="16px">
        <Text fontFamily="Oswald" fontSize="2xl">
          Sexo
        </Text>
        <Stack
          gap="16px"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Tooltip
            color="white"
            fontSize="xl"
            lineHeight="1"
            fontWeight="500"
            padding="2px 8px"
            label="Femenino"
            bgColor="blue.700"
            fontFamily="Oswald"
          >
            <Image src={Femenine} height="50px" />
          </Tooltip>
          <Text fontFamily="Oswald" fontSize="4xl" color="green.700">
            {tfemale}
          </Text>
        </Stack>
        <Stack
          gap="16px"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Tooltip
            color="white"
            fontSize="xl"
            lineHeight="1"
            fontWeight="500"
            padding="2px 8px"
            label="Masculino"
            bgColor="blue.700"
            fontFamily="Oswald"
          >
            <Image src={Male} height="50px" />
          </Tooltip>
          <Text fontFamily="Oswald" fontSize="4xl" color="yellow.700">
            {tmale}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

Gender.defaultProps = {
  defData: { female: undefined, male: undefined },
};

export default Gender;
