import {
  Box,
  Divider,
  Fade,
  Heading,
  Image,
  ScaleFade,
  SlideFade,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import LogoNinezMigrante from '../../../../assets/LogoNinezMigrante.png';
import React, { useState } from 'react';
import { useEffect } from 'react';

import LogoCoiproden from '../../../../assets/LogoCoiproden.png';
import LogoPami from '../../../../assets/LogoPAMI.png';
import LogoKnh from '../../../../assets/LogoKnh.png';

const Ongs = () => {
  const { isOpen, onToggle } = useDisclosure(true);
  const { isOpenFadeIn, onToggleFadeIn } = useDisclosure(true);
  useEffect(() => {
    onToggle(false);
  }, []);
  return (
    <Box width='100%'>
      <Stack paddingBottom='10'>
        <Stack paddingTop='5px' paddingBottom='10px'>
          <SlideFade in={isOpen} offsetY='50px'>
            <Heading fontFamily='Times' as='h6' size='xs'>
              Monitoreo binacional de niñez migrante retornda Guatemala -
              Honduras
            </Heading>
          </SlideFade>
        </Stack>
        <Stack
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          alignContent='center'
          alignItem='center'
          width='100%'
        >
          <SlideFade in={isOpen} offsetY='-50px'>
            <Heading as='h1' size='4xl' noOfLines={1} fontFamily='Oswald'>
              Monitoreo de niñez y adolescencia migrante
            </Heading>
          </SlideFade>
          <ScaleFade initialScale={0.1} in={isOpen}>
            <Image maxHeight='90px' maxWidth='90px' src={LogoNinezMigrante} />
          </ScaleFade>
        </Stack>
        <Stack paddingTop='5px' paddingBottom='10px'>
          <SlideFade in={isOpen} offsetY='-50px'>
            <Heading fontFamily='Oswald' fontWeight='normal' as='h4' size='md'>
              ORGANIZACIONES QUE IMPLEMENTAN EL Monitoreo de niñez y adolescencia migrante
            </Heading>
          </SlideFade>
        </Stack>
      </Stack>
      <Stack>
        <Tabs isLazy>
          <TabList>
            <Tab
              onClick={onToggleFadeIn}
              fontFamily='Oswald'
              _selected={{ color: 'blue.700' }}
            >
              COIPRODEN
            </Tab>
            <Tab fontFamily='Oswald' _selected={{ color: 'blue.700' }}>
              PAMI
            </Tab>
            <Tab fontFamily='Oswald' _selected={{ color: 'blue.700' }}>
              KNH y BMZ
            </Tab>
          </TabList>
          <TabPanels p={{ lg: '2rem', xs: '1rem', md: '.1rem' }}>
            <TabPanel>
              <SlideFade in={isOpen} offsetY='800px'>
                <Stack>
                  <Text fontFamily='Montserrat Medium'>
                    Es una organización no gubernamental en Honduras, de
                    carácter social, sin fines de lucro. Surge en el año 1989,
                    conformada por organizaciones que trabajan para el bienestar
                    de la niñez, adolescencia y juventud de Honduras. La Red
                    COIPRODEN representa a 25 ONG a través de las cuales se
                    ejecutan proyectos conjuntos. La base de la cooperación es
                    la aplicación de la Convención sobre los Derechos del Niño,
                    de la ONU.{' '}
                  </Text>
                </Stack>
              </SlideFade>
              <ScaleFade initialScale={0.001} in={isOpen}>
                <Stack
                  paddingTop='10'
                  width='100%'
                  paddingBottom='10'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Image src={LogoCoiproden} maxWidth='300px' />
                </Stack>
              </ScaleFade>
            </TabPanel>
            <TabPanel>
              <SlideFade in={isOpen} offsetY='800px'>
                <Stack>
                  <Text fontFamily='Montserrat Medium'>
                    Es una organización de la sociedad civil fundada en 1989,
                    con el objetivo de promover la protección integral de la
                    niñez y adolescencia guatemalteca y la restitución de sus
                    derechos humanos. Para ello, siempre trata de potenciar la
                    participación protagónica de los niños, niñas y adolescentes
                    (NNA) en la vida pública. La asociación PAMI basa su trabajo
                    en acciones de incidencia política, coherentes con la
                    Convención sobre los Derechos del Niño, de la ONU, y su
                    implementación nacional en el marco de la Ley de Protección
                    Integral de la Niñez y la Adolescencia (Ley PINA).
                  </Text>
                </Stack>
              </SlideFade>
              <ScaleFade initialScale={0.001} in={isOpen}>
                <Stack
                  paddingTop='10'
                  width='100%'
                  paddingBottom='10'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Image src={LogoPami} maxWidth='200px' />
                </Stack>
              </ScaleFade>
            </TabPanel>
            <TabPanel>
              <SlideFade in={isOpen} offsetY='800px'>
                <Stack>
                  <Text fontFamily='Montserrat Medium'>
                    Integran la cooperación alemana dedicada a apoyar niños,
                    niñas y jóvenes en extrema pobreza y en situación de riesgo,
                    sus familias y comunidades a las que pertenecen. Ha
                    acompañado a PAMI y COIPRODEN por más de una década en
                    diferentes proyectos; entre ellos, el Proyecto Binacional a
                    favor de la Niñez Migrante (2017-2020).
                  </Text>
                </Stack>
              </SlideFade>
              <ScaleFade initialScale={0.001} in={isOpen}>
                <Stack
                  paddingTop='30'
                  width='100%'
                  paddingBottom='10'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Image src={LogoKnh} maxWidth='300px' />
                </Stack>
              </ScaleFade>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Box>
  );
};

export default Ongs;
