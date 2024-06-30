// REACT
import React from 'react';

// CHAKRA UI
import { Box, Stack, VStack, Text, Image } from '@chakra-ui/react';

// ICONS
import { ArrowRightIcon } from '@chakra-ui/icons';

// ROUTER
import { Link } from 'react-router-dom';

// IMAGES
import MapaGuatemala from '../../../../assets/MapaGuatemala.svg';
import MapaHonduras from '../../../../assets/MapaHonduras.svg';
import MapaElSalvador from '../../../../assets/MapaElSalvador.svg';

const CountrySelect = () => {
  return (
    <Box
      bgColor="blue.500"
      height={{ base: '100%', md: '70vh' }}
      padding={{ base: '40px 24px', md: '80px 120px' }}
    >
      {/* SELECT COUNTRY CONTAINER */}
      <Stack
        height="100%"
        alignItems="center"
        justifyContent="center"
        gap={{ base: '40px', md: '40px' }}
        direction={{ base: 'column', md: 'row' }}
      >
        {/* GUATEMALA OPTION */}
        <Link to="/country/gt">
          <VStack spacing="24px" alignItems="center" justifyContent="center">
            <Image
              maxWidth="500px"
              src={MapaGuatemala}
              height={{ base: '200px', md: '280px' }}
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
        <Link to="/country/hn">
          <VStack spacing="24px" alignItems="center" justifyContent="center">
            <Image
              maxWidth="500px"
              src={MapaHonduras}
              height={{ base: '160px', md: '260px' }}
            />

            <Stack direction="row" alignItems="center" spacing="16px">
              <ArrowRightIcon boxSize="24px" color="gray.700" />
              <Text fontSize="4xl" fontFamily="Oswald" color="gray.700">
                Honduras
              </Text>
            </Stack>
          </VStack>
        </Link>

        {/* EL SALVADOR OPTION */}
        <Link to="/country/sv">
          <VStack spacing="24px" alignItems="center" justifyContent="center">
            <Image
              maxWidth="500px"
              src={MapaElSalvador}
              height={{ base: '200px', md: '260px' }}
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
