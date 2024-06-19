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
} from "../../../../../../utils/query/returned";

const Gender = ({
  period,
  year,
  country,
  defData: { female = undefined, male = undefined },
}) => {
  const countryID = useParams().countryID || country;

  const { data, loading, error } = useQuery(GET_BY_GENDER);
  const total = { male: 0, female: 0 };

  data?.detainedInBorders?.data?.forEach((acc, item) => {
    if (
      compareDateRange({
        start: currentPeriod[0],
        end: currentPeriod[1],
        month: item?.attributes?.month,
      })
    ) {
      if(acc?.attributes?.data?.gender?.data?.attributes?.name === "Femenino") {
        total.male += acc?.attributes?.data?.cant;
      }

      if(acc?.attributes?.data?.gender?.data?.attributes?.name === "Masculino") {
        total.female += acc?.attributes?.data?.cant;
      }
    }
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
            {female ?? total.female}
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
            {male ?? total.male}
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
