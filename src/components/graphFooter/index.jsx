import React from 'react';

import { Image, Stack, Text, Box, Link, Icon, Heading } from '@chakra-ui/react';

// ICONS
import { ViewIcon } from '@chakra-ui/icons';

// ASSETS
import LogoProyectoBinacional from '../../assets/LogoProyectoBinacional.png';
import LogoNinezMigrante from '../../assets/LogoNinezMigrante.png';
import LogoCoiproden from '../../assets/LogoCoiproden.png';
import LogoPAMI from '../../assets/LogoPAMI.png';
import LogoKnh from '../../assets/LogoKnh.png';

const GraphFooter = ({ responsive }) => {
  return (
    <Stack
      mt={10}
      direction="column"
      alignItems="center"
      paddingLeft="100px"
      paddingRight="100px"
      justifyContent="center"
    >
      <Stack direction={{ base: 'column', md: 'row' }} justifyContent="center">
        <Stack
          pr={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          borderRight="1px solid #333"
          minWidth={responsive ? 'unset' : '300px'}
        >
          <Text
            mb={2}
            width="100%"
            lineHeight={1}
            fontWeight="600"
            fontFamily="Montserrat"
            fontSize={responsive ? '0.5em' : '0.8em'}
          >
            Esta información ha sido procesada por:
          </Text>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={['space-between', 'center']}
          >
            <Link to="/">
              <Image
                w="80px"
                mb={'-25px'}
                src={LogoNinezMigrante}
                minW={responsive ? '40px' : '80px'}
              />
            </Link>

            <Stack direction="column" spacing="0px">
              <Text
                lineHeight={1}
                fontFamily="Oswald"
                fontSize={responsive ? '0.8em' : '1em'}
              >
                NiñezMigrante.org
              </Text>

              <Stack direction="row" alignItems="center">
                <Box mb={'-25px'}>
                  <Icon
                    as={ViewIcon}
                    boxSize={responsive ? '1.5em' : '2.5em'}
                    style={{ margin: 0 }}
                  />
                </Box>
                <Text
                  lineHeight={1}
                  fontWeight="400"
                  display={'inline'}
                  fontFamily="Oswald"
                  fontSize={responsive ? '0.9em' : '2.1em'}
                >
                  MOBINIM
                </Text>
              </Stack>
            </Stack>
          </Stack>
          <Text
            maxW={260}
            paddingTop={6}
            fontSize={responsive ? '0.5em' : '1em'}
            fontWeight="600"
            fontFamily="Times"
            lineHeight={1.2}
            textAlign="center"
          >
            Monitoreo binacional de niñez migrante retornada Guatemala-Honduras
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
            gap="10px"
            alignItems={'center'}
            direction={{ base: 'column', md: 'row' }}
          >
            <a href="https://www.kindernothilfe.org/" target="_blank">
              <Image src={LogoKnh} minWidth={responsive ? '100px' : '250px'} />
            </a>
            <a href="https://redcoiproden.org/" target="_blank">
              <Image
                src={LogoProyectoBinacional}
                minWidth={responsive ? '100px' : '350px'}
              />
            </a>
            <a href="https://redcoiproden.org/" target="_blank">
              <Image
                src={LogoCoiproden}
                minWidth={responsive ? '100px' : '200px'}
              />
            </a>
            <a href="https://pami-guatemala.org/" target="_blank">
              <Image src={LogoPAMI} minWidth={responsive ? '50px' : '80px'} />
            </a>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GraphFooter;
