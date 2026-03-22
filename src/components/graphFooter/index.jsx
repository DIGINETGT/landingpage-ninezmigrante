import React from "react";

import { Image, Stack, Text, Link } from "@chakra-ui/react";

// ASSETS
import LogoProyectoBinacional from "../../assets/LogoProyectoBinacional.png";
import LogoNinezMigrante from "../../assets/LogoNinezMigrante.png";
import LogoCoiproden from "../../assets/LogoCoiproden.png";
import LogoPAMI from "../../assets/LogoPAMI.png";
import LogoKnh from "../../assets/LogoKnh.png";

const GraphFooter = ({ responsive, compact = false }) => {
  const isCompact = responsive || compact;

  return (
    <Stack
      mt={10}
      direction="column"
      alignItems="center"
      maxWidth={compact ? "800px" : "unset"}
      margin="0 auto"
      paddingLeft={compact ? "40px" : "100px"}
      paddingRight={compact ? "40px" : "100px"}
      justifyContent="center"
    >
      <Stack direction={{ base: "column", md: "row" }} justifyContent="center">
        <Stack
          pr={compact ? 3 : 4}
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
                w={compact ? "56px" : "80px"}
                mb={compact ? "-12px" : "-25px"}
                src={LogoNinezMigrante}
                minW={isCompact ? (compact ? "56px" : "40px") : "80px"}
              />
            </Link>

            <Stack direction="column" spacing="0px">
              <Text
                lineHeight={1}
                fontFamily="Oswald"
                fontSize={isCompact ? "0.8em" : "1em"}
              >
                NiñezMigrante.org
              </Text>
            </Stack>
          </Stack>
          <Text
            maxW={260}
            paddingTop={compact ? 3 : 6}
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
          pl={compact ? 3 : 4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          marginBottom={compact ? "20px" : "40px"}
        >
          <Stack
            gap={compact ? "18px" : "30px"}
            alignItems={"center"}
            direction={{ base: "column", md: "row" }}
          >
            <a href="https://www.kindernothilfe.org/" target="_blank">
              <Image
                src={LogoKnh}
                minWidth={compact ? "72px" : isCompact ? "100px" : "250px"}
                maxWidth={compact ? "120px" : "unset"}
              />
            </a>
            <a href="https://redcoiproden.org/" target="_blank">
              <Image
                src={LogoProyectoBinacional}
                maxWidth={compact ? "64px" : isCompact ? "200px" : "80px"}
                minWidth={compact ? "64px" : "80px"}
              />
            </a>
            <a href="https://redcoiproden.org/" target="_blank">
              <Image
                src={LogoCoiproden}
                minWidth={compact ? "100px" : isCompact ? "100px" : "200px"}
                maxWidth={compact ? "180px" : "unset"}
              />
            </a>
            <a href="https://pami-guatemala.org/" target="_blank">
              <Image
                src={LogoPAMI}
                minWidth={compact ? "44px" : isCompact ? "50px" : "80px"}
                maxWidth={compact ? "110px" : "unset"}
              />
            </a>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GraphFooter;
