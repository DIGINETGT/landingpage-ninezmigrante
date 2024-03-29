import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

import { Box, Stack, Text } from "@chakra-ui/react";
import { colors } from "../../../../../../utils/theme";

import useFetch from "../../../../../../hooks/fetch";

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
  defData: { acd = undefined, noAcd = undefined },
}) => {
  const countryID = useParams().countryID || country;
  const [total, setTotal] = useState({ acd: acd ?? 0, noAcd: noAcd ?? 0 });

  useFetch({
    url: "/consultas/totalporcondiciondeviaje/country?anio=selectedYear&periodRange",
    year,
    periodStart: period[0],
    periodEnd: period[1],
    country: countryID,
    disableFetch: acd !== undefined || noAcd !== undefined,
    resolve: (data) => {
      let totals = { acd: 0, noAcd: 0 };
      data?.data?.forEach((stats) => {
        if (stats._id.condicion === "Acompañado") totals.acd += stats.total;
        if (stats._id.condicion === "No acompañado")
          totals.noAcd += stats.total;
      });
      setTotal(totals);
    },
  });

  const data = {
    labels: ["ACAMPANADOS", "NO ACAMPANADOS"],
    datasets: [
      {
        data: [acd ?? total.acd, noAcd ?? total.noAcd],
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
              {noAcd ?? total.noAcd}
            </Text>
          </Stack>

          {/* DATA ITEM */}
          <Stack direction="row" alignItems="center">
            <Box bgColor="green.700" width="18px" height="18px" />
            <Text fontFamily="Oswald" fontSize="md" lineHeight="1">
              Acompañados
            </Text>
            <Text fontFamily="Oswald" fontSize="2xl">
              {acd ?? total.acd}
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
