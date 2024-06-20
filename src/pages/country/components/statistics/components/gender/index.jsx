// REACT
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Image, Tooltip } from "@chakra-ui/react";

// ASSETS
import Male from "../../../../../../assets/male.png";
import Femenine from "../../../../../../assets/femenine.png";

import useFetch from "../../../../../../hooks/fetch";
import {
  GET_BY_GENDER,
  GET_DETAINED,
  GET_RETURNEDS_BY_COUNTRY_FOR_GENDER,
  GET_RETURNEDS_BY_GENDER,
} from "../../../../../../utils/query/returned";
import { useQuery } from "@apollo/client";
import { compareDateRange } from "../../../../../../utils/tools";
import useReturnedFilteredQuery from "../../../../../../hooks/query";

const Gender = ({
  period,
  year,
  country,
  defData: { female = undefined, male = undefined },
}) => {
  const data = useReturnedFilteredQuery({
    year,
    period,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_GENDER,
  });

  let tfemale = 0;
  let tmale = 0;

  data?.forEach((report) => {
    report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.country_contributions?.data?.forEach(
      (contribution) => {
        contribution.attributes?.returned?.data?.attributes?.gender_contributions?.data?.forEach(
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
            {female ?? tfemale}
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
            {male ?? tmale}
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
