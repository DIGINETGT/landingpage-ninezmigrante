// REACT
import React, { useEffect, useState } from "react";

// CHAKRA UI COMPONENTS
import { Box, Stack, Image, Text } from "@chakra-ui/react";

// ASSETS
import Male from "../../../../assets/male.png";
import Femenine from "../../../../assets/femenine.png";

// UTILS
import { year } from "../../../../utils/year";
import useFetch from "../../../../hooks/fetch";

const TotalByGender = () => {
  const [total, setTotal] = useState({ female: 0, male: 0 });

  useFetch({
    url: "/consultas/totalnnaporgenerocurrentyear",
    resolve: (data) => {
      let totals = { female: 0, male: 0 };
      data?.data.forEach((stats) => {
        if (stats._id === "Femenino") totals.female += stats.total;
        if (stats._id === "Masculino") totals.male += stats.total;
      });
      setTotal(totals);
    },
  });

  return (
    <Box width="100%">
      {/* CONTAINER */}
      <Stack
        width="100%"
        spacing="0px"
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        {/* TITLE */}
        <Box
          bgColor="white"
          padding="4px 16px"
          position="absolute"
          marginTop={{ base: "-180px", md: "-320px" }}
        >
          <Text
            textAlign="center"
            fontFamily="Oswald"
            fontSize={{ base: "3xl", md: "4xl" }}
          >
            Total de niñez migrante retornada {year}
          </Text>
        </Box>

        {/* GIRLS SECTION */}
        <Stack
          gap="16px"
          width="50%"
          direction="row"
          alignItems="center"
          bgColor="yellow.700"
          justifyContent="flex-end"
          padding={{
            base: "160px 40px 80px 40px",
            md: "180px 40px 120px 40px",
          }}
        >
          <Image
            src={Femenine}
            height="120px"
            display={{ base: "none", md: "block" }}
          />
          <Stack direction="column" spacing="-16px">
            <Text
              color="white"
              fontFamily="Oswald"
              fontSize={{ base: "4xl", md: "7xl" }}
            >
              NIÑAS
            </Text>
            <Text
              color="white"
              fontFamily="Oswald"
              fontSize={{ base: "5xl", md: "7xl" }}
            >
              {total.female}
            </Text>
          </Stack>
        </Stack>

        {/* BOYS SECTION */}
        <Stack
          gap="16px"
          width="50%"
          direction="row"
          bgColor="green.700"
          alignItems="center"
          justifyContent="flex-start"
          padding={{
            base: "160px 40px 80px 40px",
            md: "180px 40px 120px 40px",
          }}
        >
          <Stack direction="column" spacing="-16px">
            <Text
              color="white"
              fontFamily="Oswald"
              fontSize={{ base: "4xl", md: "7xl" }}
            >
              NIÑOS
            </Text>
            <Text
              color="white"
              fontFamily="Oswald"
              fontSize={{ base: "5xl", md: "7xl" }}
            >
              {total.male}
            </Text>
          </Stack>
          <Image
            src={Male}
            height="120px"
            display={{ base: "none", md: "block" }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalByGender;
