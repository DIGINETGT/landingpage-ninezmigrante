import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

import { Box, Stack, Text } from "@chakra-ui/react";
import { colors } from "../../../../../../utils/theme";

import { GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION } from "../../../../../../utils/query/returned";
import useReturnedFilteredQuery from "../../../../../../hooks/query";

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const TravelCondition = ({ period, year, country, defData }) => {
  const rdata = useReturnedFilteredQuery({
    year,
    period,
    country,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION,
  });

  let ACD = defData?.acd ?? 0;
  let NO_ACD = defData?.noAcd ?? 0;

  rdata?.forEach((report) => {
    report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.country_contributions?.data?.forEach(
      (contribution) => {
        contribution.attributes?.returned?.data?.attributes?.travel_condition_contributions?.data?.forEach(
          (conditionContribution) => {
            const travelCondition =
              conditionContribution.attributes?.travel_condition?.data?.attributes?.name?.toLowerCase();

            if (travelCondition === "acompañado") {
              ACD += conditionContribution.attributes?.cant || 0;
            } else if (travelCondition === "no acompañado") {
              NO_ACD += conditionContribution.attributes?.cant || 0;
            }
          }
        );
      }
    );
  });

  console.log({ rdata, ACD, NO_ACD });

  const data = {
    labels: ["ACAMPANADOS", "NO ACAMPANADOS"],
    datasets: [
      {
        data: [ACD, NO_ACD],
        backgroundColor: [colors.green[700], colors.blue[700]],
        borderColor: [colors.green[700], colors.blue[700]],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box width="100%">
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
        </Stack>
      </Stack>
    </Box>
  );
};

TravelCondition.defaultProps = {
  defData: { acd: undefined, noAcd: undefined },
};

export default TravelCondition;
