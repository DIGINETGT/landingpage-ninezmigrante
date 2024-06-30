// REACT
import React from "react";

// CHAKRA UI
import { Box, Stack, VStack, Text, Image } from "@chakra-ui/react";

// ICONS
import { ArrowRightIcon } from "@chakra-ui/icons";

// ROUTER
import { Link } from "react-router-dom";

// IMAGES
import MapaGuatemala from "../../../../assets/MapaGuatemala.svg";
import MapaHonduras from "../../../../assets/MapaHonduras.svg";
import MapaElSalvador from "../../../../assets/MapaElSalvador.svg";

const CountrySelect = () => {
  return (
    <Box
      bgColor="blue.500"
      height="100%"
      padding={{ base: "40px 24px 80px 24px", md: "80px 40px 120px 40px" }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing="18px"
        marginBottom={{ base: "40px", md: "60px" }}
      >
        <Text
          lineHeight="1"
          color="gray.700"
          fontFamily="Oswald"
          textAlign="center"
          fontSize={{ base: "3xl", md: "5xl" }}
        >
          Niñez y adolescencia detenida en fronteras
        </Text>
        <Text
          lineHeight="1"
          color="gray.600"
          fontFamily="Montserrat Medium"
          textAlign="center"
          fontSize={{ base: "xl", md: "2xl" }}
        >
          Selecciona un país:
        </Text>
      </Stack>
      {/* SELECT COUNTRY CONTAINER */}
      <Stack
        height="100%"
        alignItems="center"
        justifyContent="center"
        gap={{ base: "40px", md: "120px" }}
        direction={{ base: "column", md: "row" }}
      >
        {/* GUATEMALA OPTION */}
        <Link to="/borders/gt">
          <VStack spacing="24px" alignItems="center" justifyContent="center">
            <Image
              maxWidth="500px"
              src={MapaGuatemala}
              height={{ base: "200px", md: "240px" }}
            />

            <Stack direction="row" alignItems="center" spacing="16px">
              <ArrowRightIcon boxSize="24px" color="gray.700" />
              <Text fontSize="4xl" fontFamily="Oswald" color="gray.700">
                Guatemala
              </Text>
            </Stack>
          </VStack>
        </Link>

        {/* HONDURAS OPTION */}
        <Link to="/borders/hn">
          <VStack spacing="24px" alignItems="center" justifyContent="center">
            <Image
              maxWidth="500px"
              src={MapaHonduras}
              height={{ base: "160px", md: "240px" }}
            />

            <Stack direction="row" alignItems="center" spacing="16px">
              <ArrowRightIcon boxSize="24px" color="gray.700" />
              <Text fontSize="4xl" fontFamily="Oswald" color="gray.700">
                Honduras
              </Text>
            </Stack>
          </VStack>
        </Link>

        <Link to="/borders/sv">
          <VStack spacing="24px" alignItems="center" justifyContent="center">
            <Image
              maxWidth="500px"
              src={MapaElSalvador}
              height={{ base: "160px", md: "240px" }}
            />

            <Stack direction="row" alignItems="center" spacing="16px">
              <ArrowRightIcon boxSize="24px" color="gray.700" />
              <Text fontSize="4xl" fontFamily="Oswald" color="gray.700">
                El Salvador
              </Text>
            </Stack>
          </VStack>
        </Link>
      </Stack>
    </Box>
  );
};

export default CountrySelect;
