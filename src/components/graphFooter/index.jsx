import React from "react";

import { Box, Image, Stack, Text, Link } from "@chakra-ui/react";

// ASSETS
import LogoProyectoBinacional from "../../assets/LogoProyectoBinacional.png";
import LogoNinezMigrante from "../../assets/LogoNinezMigrante.png";
import LogoCoiproden from "../../assets/LogoCoiproden.png";
import LogoPAMI from "../../assets/LogoPAMI.png";
import LogoKnh from "../../assets/LogoKnh.png";

const GraphFooter = ({ responsive, compact = false, fullWidth = false }) => {
  const isCompact = responsive || compact;

  if (compact) {
    return (
      <Stack
        mt={6}
        direction="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        maxWidth={fullWidth ? "100%" : "800px"}
        margin="0 auto"
        px={fullWidth ? "24px" : "0"}
        spacing={4}
      >
        <Stack direction="column" alignItems="center" spacing={2}>
          <Text
            lineHeight={1}
            fontWeight="600"
            fontFamily="Montserrat"
            fontSize="0.55em"
            textAlign="center"
          >
            Esta información ha sido procesada por:
          </Text>
        </Stack>

        <Box
          display="grid"
          gridTemplateColumns="repeat(5, minmax(0, 1fr))"
          alignItems="center"
          width="100%"
          columnGap={fullWidth ? "12px" : "10px"}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Link to="/" _hover={{ textDecoration: "none" }}>
              <Stack direction="row" alignItems="center" spacing={2} minW="0">
                <Image
                  src={LogoNinezMigrante}
                  h="36px"
                  w="36px"
                  minW="36px"
                  objectFit="contain"
                />
                <Text
                  lineHeight={1}
                  fontFamily="Oswald"
                  fontSize="0.75em"
                  whiteSpace="nowrap"
                >
                  NiñezMigrante.org
                </Text>
              </Stack>
            </Link>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <a href="https://www.kindernothilfe.org/" target="_blank">
              <Image src={LogoKnh} h="44px" objectFit="contain" />
            </a>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <a href="https://redcoiproden.org/" target="_blank">
              <Image src={LogoProyectoBinacional} h="40px" objectFit="contain" />
            </a>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <a href="https://redcoiproden.org/" target="_blank">
              <Image src={LogoCoiproden} h="46px" objectFit="contain" />
            </a>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <a href="https://pami-guatemala.org/" target="_blank">
              <Image src={LogoPAMI} h="50px" objectFit="contain" />
            </a>
          </Box>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      mt={10}
      direction="column"
      alignItems="center"
      maxWidth="unset"
      margin="0 auto"
      paddingLeft={isCompact ? "32px" : "100px"}
      paddingRight={isCompact ? "32px" : "100px"}
      justifyContent="center"
    >
      <Stack direction={{ base: "column", md: "row" }} justifyContent="center">
        <Stack
          pr={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          borderRight="1px solid #333"
          minWidth={isCompact ? "unset" : "300px"}
        >
          <Text
            mb={2}
            width="100%"
            lineHeight={1}
            fontWeight="600"
            fontFamily="Montserrat"
            fontSize={isCompact ? "0.5em" : "0.8em"}
          >
            Esta información ha sido procesada por:
          </Text>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={["space-between", "center"]}
          >
            <Link to="/">
              <Image
                w={isCompact ? "36px" : "80px"}
                mb={isCompact ? "0" : "-25px"}
                src={LogoNinezMigrante}
                minW={isCompact ? "36px" : "80px"}
                objectFit="contain"
              />
            </Link>

            <Stack direction="column" spacing="0px">
              <Text
                lineHeight={1}
                fontFamily="Oswald"
                fontSize={isCompact ? "0.72em" : "1em"}
              >
                NiñezMigrante.org
              </Text>
            </Stack>
          </Stack>
          <Text
            maxW={260}
            paddingTop={6}
            fontSize={isCompact ? "0.5em" : "1em"}
            fontWeight="600"
            fontFamily="Times"
            lineHeight={1.2}
            textAlign="center"
          >
            Monitoreo de niñez y adolescencia migrante
          </Text>
        </Stack>
        <Stack
          pl={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          marginBottom="40px"
        >
          <Stack
            gap={isCompact ? "12px" : "30px"}
            alignItems={"center"}
            direction={{ base: "column", md: "row" }}
          >
            <a href="https://www.kindernothilfe.org/" target="_blank">
              <Image
                src={LogoKnh}
                maxH={isCompact ? "56px" : "unset"}
                maxW={isCompact ? "170px" : "250px"}
                minWidth={isCompact ? "unset" : "250px"}
                objectFit="contain"
              />
            </a>
            <a href="https://redcoiproden.org/" target="_blank">
              <Image
                src={LogoProyectoBinacional}
                maxH={isCompact ? "44px" : "unset"}
                maxWidth={isCompact ? "72px" : "80px"}
                minWidth={isCompact ? "unset" : "80px"}
                objectFit="contain"
              />
            </a>
            <a href="https://redcoiproden.org/" target="_blank">
              <Image
                src={LogoCoiproden}
                maxH={isCompact ? "72px" : "unset"}
                maxW={isCompact ? "180px" : "unset"}
                minWidth={isCompact ? "unset" : "200px"}
                objectFit="contain"
              />
            </a>
            <a href="https://pami-guatemala.org/" target="_blank">
              <Image
                src={LogoPAMI}
                maxH={isCompact ? "74px" : "unset"}
                maxW={isCompact ? "96px" : "unset"}
                minWidth={isCompact ? "unset" : "80px"}
                objectFit="contain"
              />
            </a>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GraphFooter;
