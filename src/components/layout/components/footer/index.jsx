// REACT
import React from 'react';

// CHAKRA UI
import { Box, Divider, Stack, Text, Image } from '@chakra-ui/react';

import { Link } from 'react-router-dom';

// ASSETS
import LogoCoiproden from '../../../../assets/LogoCoiproden.png';
import LogoProyectoBinacional from '../../../../assets/LogoProyectoBinacional.png';
import LogoPAMI from '../../../../assets/LogoPAMI.png';
import LogoKnh from '../../../../assets/LogoKnh.png';
import LogoGMIES from '../../../../assets/LogoGMIES.png';
import LogoRROCM from '../../../../assets/LogoRROCM.png';
import footer from '../../../../assets/footer.png';

const Footer = () => {
  return (
    <>
      <Box padding="40px 24px 0px 24px">
        {/* CONTAINER */}
        <Stack
          gap="20px"
          padding={{ base: '16px', md: '24px' }}
          direction={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'flex-start', md: 'center' }}
          justifyContent={{ base: 'flex-start', md: 'center' }}
        >
          {/* ITEMS */}
          <Stack
            direction="column"
            spacing="16px"
            alignItems={{ base: 'flex-start', md: 'flex-end' }}
            justifyContent={{ base: 'flex-start', md: 'flex-end' }}
          >
            <Link to="/observatory">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                Monitoreo
              </Text>
            </Link>

            <Link to="/country/gt">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                Guatemala
              </Text>
            </Link>

            <Link to="/country/hn">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                Honduras
              </Text>
            </Link>

            <Link to="/country/sv">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                El Salvador
              </Text>
            </Link>

            <Link to="/customize">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                Personalizar
              </Text>
            </Link>

            <Link to="/compare">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                Comparar
              </Text>
            </Link>

            <Link to="/borders">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                Detenidos
              </Text>
            </Link>

            <Link to="/organizations">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                Organizaciones
              </Text>
            </Link>

            <Link to="/documentation">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                Documentación
              </Text>
            </Link>

            <Link to="/contact">
              <Text fontFamily="Montserrat Medium" color="gray.600">
                Contacto
              </Text>
            </Link>
          </Stack>

          {/* DIVIDER */}
          <Divider
            height="400px"
            borderWidth="1px"
            orientation="vertical"
            borderColor="yellow.700"
            display={{ base: 'none', md: 'block' }}
          />

          {/* LOGOS */}
          <Stack
            gap="24px"
            alignItems={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
          >
            <a href="https://www.kindernothilfe.org/" target="_blank">
              <Image src={LogoKnh} maxHeight="100px" />
            </a>

            <a
              href="http://pami-guatemala.org/proyectobinacionalmigracion/"
              target="_blank"
            >
              <Image src={LogoProyectoBinacional} maxWidth="100px" />
            </a>

            <a href="https://redcoiproden.org/" target="_blank">
              <Image src={LogoCoiproden} maxHeight="100px" />
            </a>

            <a href="https://pami-guatemala.org/" target="_blank">
              <Image src={LogoPAMI} maxWidth="100px" />
            </a>

            <a href="https://gmies.org" target="_blank">
              <Image src={LogoGMIES} maxWidth="100px" />
            </a>

            <a href="https://rrocm.net" target="_blank">
              <Image src={LogoRROCM} maxWidth="100px" />
            </a>
          </Stack>
        </Stack>
      </Box>
      <Stack width="100%">
        <Image src={footer} objectFit="cover" />
      </Stack>
    </>
  );
};

export default Footer;
