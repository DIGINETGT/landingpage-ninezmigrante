import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

import { Box, Stack, Text } from "@chakra-ui/react";
import { colors } from "../../../../../../utils/theme";

import { GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION } from "../../../../../../utils/query/returned";
import useReturnedFilteredQuery from "../../../../../../hooks/query";
import Loader from "../../../../../../components/loader";

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const TravelCondition = ({
  period,
  year,
  country,
  defData,
  skip,
  loading: load,
}) => {
  const { countryID: id } = useParams();
  const countryId = country || id;

  const { data: rdata, loading: loadingQuery } = useReturnedFilteredQuery({
    year,
    period,
    country,
    skip,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION(
      countryId,
      period,
      year
    ),
  });

  const loading = load ?? loadingQuery;

  let ACD = defData?.acd ?? 0;
  let NO_ACD = defData?.noAcd ?? 0;
  let UN_REGISTRED = defData?.unRegistred ?? 0;

  rdata?.forEach((report) => {
    report.attributes?.returned?.data?.attributes?.travel_condition_contributions?.data?.forEach(
      (conditionContribution) => {
        const travelCondition =
          conditionContribution.attributes?.travel_condition?.data?.attributes?.name?.toLowerCase();

        if (travelCondition === "acompañado") {
          ACD += conditionContribution.attributes?.cant || 0;
        } else if (travelCondition === "no acompañado") {
          NO_ACD += conditionContribution.attributes?.cant || 0;
        } else if (travelCondition === "otros") {
          UN_REGISTRED += conditionContribution.attributes?.cant || 0;
        }
      }
    );
  });

  const data = {
    labels: ["ACAMPANADOS", "NO ACAMPANADOS", "OTROS"],
    datasets: [
      {
        data: [ACD, NO_ACD, UN_REGISTRED],
        backgroundColor: [
          colors.green[700],
          colors.blue[700],
          colors.yellow[700],
        ],
        borderColor: [colors.green[700], colors.blue[700], colors.yellow[700]],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box width="100%" position="relative">
      <Loader loading={loading} />

      {/* TITLE */}
      <Stack justifyContent="center" alignItems="center">
        <Text fontFamily="Oswald" fontSize="2xl">
          Condición de viaje
        </Text>

        {/* PIE CHART */}
        <Box maxWidth="200px">
          <Pie data={data} options={options} />
        </Box>

        <Stack direction="column" spacing="-8px">
          {/* DATA ITEM */}
          <Stack direction="row" alignItems="center">
            <Box bgColor="blue.700" width="18px" height="18px" />
            <Text fontFamily="Oswald" fontSize="md" lineHeight="1">
              No Acompañados
            </Text>
            <Text fontFamily="Oswald" fontSize="2xl">
              {NO_ACD}
            </Text>
          </Stack>

          {/* DATA ITEM */}
          <Stack direction="row" alignItems="center">
            <Box bgColor="green.700" width="18px" height="18px" />
            <Text fontFamily="Oswald" fontSize="md" lineHeight="1">
              Acompañados
            </Text>
            <Text fontFamily="Oswald" fontSize="2xl">
              {ACD}
            </Text>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Box bgColor="yellow.700" width="18px" height="18px" />
            <Text fontFamily="Oswald" fontSize="md" lineHeight="1">
              Otros
            </Text>
            <Text fontFamily="Oswald" fontSize="2xl">
              {UN_REGISTRED}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

TravelCondition.defaultProps = {
  defData: { acd: undefined, noAcd: undefined },
};

export default TravelCondition;
